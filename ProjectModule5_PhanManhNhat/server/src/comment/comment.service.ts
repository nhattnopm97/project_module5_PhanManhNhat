import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { Pin } from '../pin/pin.entity';
import { Users } from '../users/user.entity';
import { LikeComment } from './likeCmt.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(Pin)
    private pinRipo: Repository<Pin>,

    @InjectRepository(Users)
    private userRipo: Repository<Users>,

    @InjectRepository(LikeComment)
    private likeCommentRepo: Repository<LikeComment>,
  ) {}

  findAll() {
    return this.commentRepo.find();
  }

  async findOneByPin(id: number) {
    let cmtInPin = await this.commentRepo
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.pin', 'pin')
      .innerJoinAndSelect('comment.users', 'users')
      .where('pin.id = :pinId', { pinId: id })
      .getMany();

    return cmtInPin;
  }

  async createComment(content: string, userId: number, pinId: number) {
    try {
      let findPin = await this.pinRipo.findOne({ where: { id: pinId } });
      let findUser = await this.userRipo.findOne({ where: { id: userId } });
      if (findUser && findPin) {
        let newComment = new Comment();
        newComment.content = content;
        newComment.pin = findPin;
        newComment.users = findUser;
        newComment.timecomment = new Date();
        return this.commentRepo.save(newComment);
      } else {
        throw new BadRequestException('Bình luận không hợp lệ!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async newLikeComment(commentId: number, userId: number) {
    try {
      let findComment = await this.commentRepo.findOne({
        where: { id: commentId },
      });
      let findUser = await this.userRipo.findOne({
        where: { id: userId },
      });
      if (findComment && findUser) {
        let newLike = new LikeComment();
        newLike.comment = findComment;
        newLike.user = findUser;
        return await this.likeCommentRepo.save(newLike);
      } else {
        throw new BadRequestException('Yêu cầu không hợp lệ!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getLikeComment(cmtId: number) {
    try {
      let findCmt = await this.commentRepo.findOne({ where: { id: cmtId } });
      if (findCmt) {
        let result = await this.likeCommentRepo.find({
          where: { comment: findCmt },
          relations: ['user', 'comment'],
        });
        return result;
      } else {
        throw new BadRequestException('Yêu cầu không hợp lệ!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteLikeComment(id: number) {
    try {
      return await this.likeCommentRepo.delete({ id });
    } catch (error) {
      console.log(error);
    }
  }
}
