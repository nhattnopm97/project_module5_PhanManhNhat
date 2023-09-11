import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection } from './collection.entity';
import { UsersModule } from '../users/users.module';
import { Users } from '../users/user.entity';
import { Pin } from '../pin/pin.entity';
import { PinInCollection } from '../pin/pinInCollection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, Users, Pin, PinInCollection]),
    UsersModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
