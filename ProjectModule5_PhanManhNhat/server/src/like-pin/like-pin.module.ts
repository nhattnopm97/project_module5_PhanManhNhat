import { Module } from '@nestjs/common';
import { LikePinController } from './like-pin.controller';
import { LikePinService } from './like-pin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLikePin } from './userLikePin.entity';
import { PinModule } from '../pin/pin.module';
import { UsersModule } from '../users/users.module';
import { Pin } from '../pin/pin.entity';
import { Users } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikePin, Pin, Users]),
    PinModule,
    UsersModule,
  ],
  controllers: [LikePinController],
  providers: [LikePinService],
})
export class LikePinModule {}
