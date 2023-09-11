import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PinController } from './pin.controller';
import { PinService } from './pin.service';
import { Pin } from './pin.entity';
import { UsersModule } from '../users/users.module';
import { Users } from '../users/user.entity';
import { PinInCollection } from './pinInCollection.entity';
import { CollectionModule } from '../collection/collection.module';
import { Collection } from '../collection/collection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pin, Users, PinInCollection, Collection]),
    UsersModule,
    CollectionModule,
  ],
  controllers: [PinController],
  providers: [PinService],
})
export class PinModule {}
