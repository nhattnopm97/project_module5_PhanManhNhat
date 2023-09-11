import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pin } from '../pin/pin.entity';
import { Users } from '../users/user.entity';
import { LikeComment } from './likeCmt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Pin, Users, LikeComment])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
