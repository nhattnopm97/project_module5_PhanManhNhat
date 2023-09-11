import { InjectRepository } from '@nestjs/typeorm';
import { Pin } from './pin.entity';
import { Repository } from 'typeorm';
import { Users } from '../users/user.entity';
import { PinInCollection } from './pinInCollection.entity';
import { Collection } from '../collection/collection.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(Pin)
    private pinRipo: Repository<Pin>,

    @InjectRepository(Users)
    private userRipo: Repository<Users>,

    @InjectRepository(PinInCollection)
    private pICRepo: Repository<PinInCollection>,

    @InjectRepository(Collection)
    private collectionRipo: Repository<Collection>,
  ) {}

  async findUserById(id: number) {
    return await this.userRipo.findOneBy({ id });
  }

  findAll() {
    return this.pinRipo.find();
  }
  async findOne(id: number) {
    return await this.pinRipo.findOne({ where: { id }, relations: ['users'] });
  }

  async findPinIntoCollection(userId: number) {
    try {
      let pinInClt = await this.pICRepo
        .createQueryBuilder('pinInCollection')
        .innerJoinAndSelect('pinInCollection.pin', 'pin')
        .innerJoinAndSelect('pinInCollection.collection', 'collection')
        .innerJoin('collection.users', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
      return pinInClt;
    } catch (error) {
      console.log(error);
    }
  }

  async findPinInCollectionByCollectionId(collectionId: number) {
    try {
      let result = await this.pICRepo
        .createQueryBuilder('PIC')
        .innerJoinAndSelect('collection.pin', 'pin')
        .innerJoinAndSelect('collection.collection', 'collection')
        .where('collection.id =:collectionId', { collectionId })
        .getMany();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findPinOfUser(id: number) {
    try {
      let userFinded = await this.userRipo.findOne({ where: { id } });
      if (userFinded) {
        let pinFinded = await this.pinRipo.find({
          where: { users: userFinded },
        });
        return pinFinded;
      } else {
        throw new BadRequestException('Yêu cầu không hợp lệ!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveIntoCollection(
    pinId: number,
    collectionId: number,
    userId: number,
  ) {
    let pinInClt = await this.pICRepo
      .createQueryBuilder('pinInCollection')
      .innerJoinAndSelect('pinInCollection.pin', 'pin')
      .innerJoinAndSelect('pinInCollection.collection', 'collection')
      .innerJoin('collection.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
    let pin = await this.pinRipo.findOneBy({ id: pinId });
    let collection = await this.collectionRipo.findOneBy({ id: collectionId });
    let findSaved = pinInClt.find((pins) => pins.pin.id === pin.id);
    if (pin && collection) {
      if (findSaved !== undefined) {
        throw new BadRequestException('Pin đã được được lưu trước đó');
      } else {
        const pinInCollection = new PinInCollection();
        pinInCollection.pin = pin;
        pinInCollection.collection = collection;
        return await this.pICRepo.save(pinInCollection);
      }
    } else {
      throw new BadRequestException('Pin hoặc collection không tồn tại!');
    }
  }

  async removePinFromCollection(
    pinId: number,
    collectionId: number,
    userId: number,
  ) {
    const pinInClt = await this.pICRepo
      .createQueryBuilder('pinInCollection')
      .innerJoinAndSelect('pinInCollection.pin', 'pin')
      .innerJoinAndSelect('pinInCollection.collection', 'collection')
      .innerJoin('collection.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('pin.id = :pinId', { pinId })
      .andWhere('collection.id = :collectionId', { collectionId })
      .getOne();
    if (pinInClt) {
      return await this.pICRepo.remove(pinInClt);
    } else {
      throw new NotFoundException('Không tìm thấy liên kết pin và collection');
    }
  }

  async findPinRelate(id: number) {
    try {
      let findPin = await this.pinRipo.findOne({ where: { id } });
      if (!findPin) {
        throw new BadRequestException('Không tìm thấy pin!');
      }

      let tags = findPin.tag.split(',');
      const orConditions = tags
        .map((_, index) => `pin.tag LIKE :tag${index}`)
        .join(' OR ');
      const queryParams = tags.reduce((acc, tag, index) => {
        acc[`tag${index}`] = `%${tag}%`;
        return acc;
      }, {});

      let relatedPins = await this.pinRipo
        .createQueryBuilder('pin')
        .where(`(${orConditions})`, queryParams)
        .andWhere('pin.id != :pinId', { pinId: id })
        .getMany();

      return relatedPins;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Có lỗi xảy ra khi xử lý dữ liệu!');
    }
  }

  async create(pin: Pin) {
    try {
      let result = await this.pinRipo.save(pin);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deletePin(pinId: number, userId: number) {
    try {
      let findUser = await this.userRipo.findOne({ where: { id: userId } });
      if (findUser) {
        let findPin = await this.pinRipo.findOne({
          where: { id: pinId, users: findUser },
        });
        if (findPin) {
          findPin.status = 3;
          let result = await this.pinRipo.save(findPin);
          return result;
        } else {
          throw new BadRequestException('Yêu cầu không hợp lệ!');
        }
      } else {
        throw new BadRequestException('Yêu cầu không hợp lệ!');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
