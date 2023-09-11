import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post()
  create(@Body() body: { content: string; userId: number; pinId: number }) {
    return this.commentService.createComment(
      body.content,
      body.userId,
      body.pinId,
    );
  }

  @Post('/likecomment')
  newLikeComment(@Body() body: { commentId: number; userId: number }) {
    return this.commentService.newLikeComment(+body.commentId, +body.userId);
  }

  @Get()
  getAll() {
    return this.commentService.findAll();
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.commentService.findOneByPin(+id);
  }

  @Get('/likecomment/:id')
  getLikeComment(@Param('id') id: number) {
    return this.commentService.getLikeComment(+id);
  }

  @Delete('/likecomment/:id')
  deleteLikeComment(@Param('id') id: number) {
    return this.commentService.deleteLikeComment(+id);
  }
}
