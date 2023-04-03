import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  IUserAuthloginService,
  IUserAuthServiceGetAccessToken,
  IUserAuthServiceLogout,
} from './interfaces/auth-service.interface';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async login({ email, password, context }: IUserAuthloginService) {
    const user = await this.userRepository.findOne({ where: { email } });

    // 존재하는 유저인지 검증
    if (!user) {
      throw new UnprocessableEntityException('회원이 존재하지 않습니다.');
    }

    // 비밀번호 틀렸을때
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('암호가 틀렸습니다.');
    }

    const refreshToken = await this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );

    const permittedOrigins = [
      'http://localhost:3000',
      'https://mydatabase.backkim.shop',
      'http://127.0.0.1:5500',
      'https://backkim.shop',
      'http://localhost:5500',
      'http://localhost:5501',
      'https://cafemoa.shop',
    ];
    const req = context.req;
    const res = context.res;
    const origin = req.headers.origin;
    if (permittedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Crdential', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; domain=.backkim.shop; SameSite=None; Secure; httpOnly; path=/;`,
    );

    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }

  getAccessToken({ user }: IUserAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }

  async logout({ context }: IUserAuthServiceLogout): Promise<string> {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );

    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );

    try {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_KEY,
      );
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
      );

      const currentTime = new Date().getTime();
      const accessTokenTtl =
        decodedAccessToken['exp'] - Number(String(currentTime).slice(0, -3));
      const refreshTokenTtl =
        decodedRefreshToken['exp'] - Number(String(currentTime).slice(0, -3));

      await this.cacheManager.set(
        `accessToken:${accessToken}`,
        `accessToken`,
        accessTokenTtl,
      );

      await this.cacheManager.set(
        `refreshToken:${refreshToken}`,
        `refreshToken`,
        refreshTokenTtl,
      );
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return '로그아웃 되었습니다.';
  }
}
