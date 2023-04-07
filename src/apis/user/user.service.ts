import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUserServiceCreate,
  IUserServiceUpdate,
} from './interfaces/user-service.interface';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ createUserInput }: IUserServiceCreate): Promise<User> {
    const { password, email, ...User } = createUserInput;

    const is_Valid = await this.userRepository.findOne({ where: { email } });

    if (is_Valid) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.save({
      password: hashedPassword,
      email,
      ...User,
    });
  }

  async emailVerify({ email }) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('이미 등록된 회원입니다');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const verifyNum = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0',
    );

    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: '[카페모아] 이메일 인증번호가 발급되었습니다.',
      html: `
      <html>
        <body>
            <div style ="display: flex; flex-direction: column; justify-content: center; width:600px;">
                
                    <h1>안녕하세요 카페모아입니다!</h1>
                    <br />
                    <div>요청하신 카페모아의 이메일 인증번호를 안내드립니다.</div>
                    <div>아래 번호를 입력하여 인증절차를 완료해 주세요.</div>
                    <br />
                    <div style= "font-weight: bold">인증번호 : ${verifyNum}</div>
                    <br /><br />
            </div>
        </body>
    </html>`,
    });

    return verifyNum;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({});
  }

  async find({ id }): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findCouponUser({ phone, page }) {
    if (phone) {
      return this.userRepository.find({
        where: { phone: Like(`%%${phone}`) },
        take: 10,
        skip: page === undefined ? 0 : (page-1) * 10,
      });
    } else {
      return this.userRepository.find({
        where: { phone },
        take: 10,
        skip: page === undefined ? 0 : (page-1) * 10,
      });
    }
  }

  async update({
    updateUserInput,
    context,
  }: IUserServiceUpdate): Promise<User> {
    const userId = context.req.user.id;
    let { password, ...user } = updateUserInput;

    const result = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    return this.userRepository.save({
      ...result,
      password,
      ...user,
    });
  }

  async delete({ userId }): Promise<boolean> {
    const result = await this.userRepository.delete({ id: userId });
    return result.affected ? true : false;
  }

  async findUserPwd({ email }) {
    const password = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0',
    );
    const user = await this.userRepository.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: '[카페모아] 임시비밀번호가 발급되었습니다.',
      html: `
      <html>
        <body>
            <div style ="display: flex; flex-direction: column; justify-content: center; width:600px;">
                    <h1>안녕하세요 ${user.name}님, 카페모아입니다.</h1>
                    <br />
                    <div>${user.name}님의 임시 비밀번호는 다음과 같습니다.</div>
                    <div style = "font-weight: bold;">임시비밀번호: ${password} </div>
                    <br />
                    <div>개인정보 보호를 위해 로그인 후 새로운 비밀번호로 변경해 주시기 바랍니다.</div>
                    <div>저희 카페모아를 이용해 주셔서 감사합니다.</div>
                    <br /><br />
                    <buttton style="
                    background-color: #81564B;
                    text-align: center;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    font-size:24px;
                    width: 200px;
                    padding:20px 60px;
                    outline: none;
                    border: none;
                    border-radius:5px;
                     ;"><a href="https://cafemoa.shop/login/" style="color: #FFFFFF; text-decoration: none; ">카페모아로 이동</a></button>
            </div>
        </body>
    </html>`,
    });

    return '메일이 전송되었습니다.';
  }
}
