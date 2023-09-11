import { Injectable, BadRequestException } from '@nestjs/common';
import { UserLikePin } from './userLikePin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from '../pin/pin.entity';
import { Users } from '../users/user.entity';

@Injectable()
export class LikePinService {
  constructor(
    @InjectRepository(UserLikePin)
    private likePinRepo: Repository<UserLikePin>,

    @InjectRepository(Pin)
    private pinRepo: Repository<Pin>,

    @InjectRepository(Users)
    private userRepo: Repository<Users>,
  ) {}

  async getLikePin(id: number) {
    try {
      let findPin = await this.pinRepo.findOne({ where: { id: id } });
      if (findPin) {
        let result = await this.likePinRepo
          .createQueryBuilder('likePin')
          .innerJoinAndSelect('likePin.pin', 'pin')
          .innerJoinAndSelect('likePin.user', 'user')
          .where('pin.id  = :pinId', { pinId: findPin.id })
          .getMany();
        return result;
      } else {
        throw new BadRequestException('Pin không tồn tại');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createNewLike(pinId: number, userId: number) {
    try {
      let findPin = await this.pinRepo.findOne({ where: { id: pinId } });
      let findUser = await this.userRepo.findOne({ where: { id: userId } });
      if (findUser && findPin) {
        let newLike = new UserLikePin();
        newLike.user = findUser;
        newLike.pin = findPin;
        return this.likePinRepo.save(newLike);
      } else {
        throw new BadRequestException('Yêu cầu không hợp lệ!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteALike(pinId: number, userId: number) {
    try {
      let findPin = await this.pinRepo.findOne({ where: { id: pinId } });
      let findUser = await this.userRepo.findOne({ where: { id: userId } });
      if (findUser && findPin) {
        let findLike = await this.likePinRepo.findOne({
          where: { user: findUser, pin: findPin },
        });
        if (findLike) {
          let result = await this.likePinRepo.delete({ id: findLike.id });
          return result;
        } else {
          throw new BadRequestException('Bạn chưa like pin này!');
        }
      } else {
        throw new BadRequestException('Yêu cầu không hợp lệ!');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
