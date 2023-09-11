import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Collection } from './collection.entity';
import { Users } from '../users/user.entity';
import { PinInCollection } from '../pin/pinInCollection.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectRepo: Repository<Collection>,

    @InjectRepository(Users)
    private userRepo: Repository<Users>,

    @InjectRepository(PinInCollection)
    private pinICltRepo: Repository<PinInCollection>,
  ) {}

  async addToCollection(collection) {
    let allCltOfUser = await this.collectRepo
      .createQueryBuilder('collection')
      .where('collection.users.id = :userId', { userId: collection.userId })
      .getMany();
    let findClt = allCltOfUser.find((c) => c.name === collection.name);
    let userFind = await this.userRepo.findOne({
      where: { id: collection.userId },
    });
    if (userFind) {
      if (findClt !== undefined) {
        throw new BadRequestException('Tên bảng đã tồn tại');
      } else {
        let newCollection = new Collection();
        let currentDate = new Date();
        newCollection.name = collection.name;
        newCollection.thumbnail = collection.thumbnail;
        newCollection.createDate = currentDate;
        newCollection.status = collection.status;
        newCollection.users = userFind;
        return await this.collectRepo.save(newCollection);
      }
    } else {
      throw new BadRequestException('Người dùng không hợp lệ!');
    }
  }

  getAll() {
    return this.collectRepo.find();
  }

  async getOne(id: number) {
    return await this.collectRepo
      .createQueryBuilder('collection')
      .where('collection.users.id = :userId', { userId: id })
      .getMany();
  }

  async getCollectionById(id: number) {
    return await this.collectRepo.findOne({ where: { id } });
  }

  async getPinInCollection(collectionId: Number) {
    console.log('collectionId', collectionId);
    try {
      let pinInClt = await this.pinICltRepo
        .createQueryBuilder('pinInCollection')
        .innerJoinAndSelect('pinInCollection.pin', 'pin')
        .innerJoinAndSelect('pinInCollection.collection', 'collection')
        .where('collection.id = :collectionId', { collectionId: collectionId })
        .getMany();
      return pinInClt;
    } catch (error) {
      console.log(error);
    }
  }
}
