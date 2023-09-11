import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinModule } from './pin/pin.module';
import { Pin } from './pin/pin.entity';
import { CollectionModule } from './collection/collection.module';
import { Collection } from './collection/collection.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/comment.entity';
import { PinInCollection } from './pin/pinInCollection.entity';
import { Subcriber } from './users/userSubscriber';
import { LikePinModule } from './like-pin/like-pin.module';
import { UserLikePin } from './like-pin/userLikePin.entity';
import { LikeComment } from './comment/likeCmt.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Users } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'pinterest',
      entities: [
        Users,
        Pin,
        Collection,
        Comment,
        PinInCollection,
        Subcriber,
        UserLikePin,
        LikeComment,
      ],
      synchronize: true,
    }),
    UsersModule,
    PinModule,
    CollectionModule,
    CommentModule,
    LikePinModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
