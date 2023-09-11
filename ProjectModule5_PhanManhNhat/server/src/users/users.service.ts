import { subscribe } from 'diagnostics_channel';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { Users } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UserUpdate } from './userDto';
import * as bcrypt from 'bcrypt';
import { Subcriber } from './userSubscriber';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private JwtService: JwtService,

    @InjectRepository(Subcriber)
    private subRepo: Repository<Subcriber>,
  ) {}

  async create(user) {
    return this.userRepository.create(user);
  }

  async createSubcriber(userSubcriberId: number, userSubcribedId: number) {
    try {
      let finduserSuber = await this.userRepository.findOne({
        where: { id: userSubcriberId },
      });
      let finduserSubed = await this.userRepository.findOne({
        where: { id: userSubcribedId },
      });

      if (finduserSuber && finduserSubed) {
        const existingSubscriber = await this.subRepo
          .createQueryBuilder('userSub')
          .innerJoin(
            'userSub.userSubcriber',
            'userSubcriber',
            'userSubcriber.id = :subcriberId',
            { subcriberId: finduserSuber.id },
          )
          .innerJoin(
            'userSub.userSubcribed',
            'userSubcribed',
            'userSubcribed.id = :subcribedId',
            { subcribedId: finduserSubed.id },
          )
          .getOne();
        if (!existingSubscriber) {
          const newSubscriber = new Subcriber();
          newSubscriber.userSubcriber = finduserSuber;
          newSubscriber.userSubcribed = finduserSubed;

          let result = await this.subRepo.save(newSubscriber);
          return result;
        } else {
          throw new BadGatewayException('Người dùng đã đăng ký trước đó.');
        }
      } else {
        throw new BadRequestException('Có vấn đề về đăng nhập');
      }
    } catch (error) {
      console.log(error);
      if (error instanceof BadGatewayException) {
        throw new BadGatewayException('Người dùng đã đăng ký trước đó.');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Có vấn đề về đăng nhập');
      } else {
        throw new BadRequestException('Lỗi server');
      }
    }
  }

  async register(user: CreateUserDto) {
    let find = await this.userRepository.findOne({
      where: { email: user.email },
    });
    user.createdate = new Date(user.createdate);
    if (find) {
      throw new BadRequestException('Email đã được đăng ký');
    } else {
      let newUser = this.userRepository.create(user);
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      return await this.userRepository.save(newUser);
    }
  }

  async login(user: { email: string; password: string; token?: string }) {
    let find = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!find) {
      throw new BadRequestException('Tài khoản hoặc mật khẩu không chính xác!');
    } else {
      let compare = await bcrypt.compare(user.password, find.password);
      if (compare) {
        const payload = { sub: find.id, email: find.email };
        let token = await this.JwtService.signAsync(payload);
        delete find.password;
        return {
          ...find,
          token,
        };
      } else {
        throw new BadRequestException(
          'Tài khoản hoặc mật khẩu không chính xác!',
        );
      }
    }
  }

  async getSubcriber(userId: number) {
    try {
      const sub = await this.subRepo
        .createQueryBuilder('sub')
        .leftJoinAndSelect('sub.userSubcribed', 'subcriber')
        .where('sub.userSubcriber = :userId', { userId: userId })
        .getMany();

      return sub;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    let result = await this.userRepository.findOne({ where: { id } });
    delete result.password;
    return result;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async unSubcriber(id: number) {
    return this.subRepo
      .createQueryBuilder('sub')
      .delete()
      .from(Subcriber)
      .where('id = :id', { id })
      .execute();
  }

  async updateUser(user: UserUpdate) {
    return await this.userRepository.save(user);
  }
}
