import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Injectable()
export class OwnerAuthService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>, //
    private readonly jwtService: JwtService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManger: Cache,
  ) {}

  async checkEmail({ email, password }) {
    const user = await this.ownerRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('이메일을 확인해주세요');
    }

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');
  }

  setRefreshToken({ user, res, req }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id }, //
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
    const origin = req.headers.origin;
    if (permittedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin, Accept, X-Requested-with, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );

    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; domain=.backkim.shop; SameSite=None; Secure; httpOnly; path=/; `,
    );
    // res.setHeader('Set-Cookie', `refreshToken= ${refreshToken}`);
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }

  async logout({ context }) {
    const refresh_token = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    const access_token = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    console.log(refresh_token, access_token);

    try {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_KEY);
      const decodedR = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY);
      const expireTime = decoded['exp'] - decoded['iat'];
      const expireTimeR = decodedR['exp'] - decodedR['iat'];

      await this.cacheManger.set(
        `accessToken:${access_token}`,
        'accessToken',
        expireTime,
      );

      await this.cacheManger.set(
        `refreshToken:${refresh_token}`,
        'refreshToken',
        expireTimeR,
      );
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    return '로그아웃에 성공하였습니다.';
  }
}
