import { LikePinService } from './like-pin.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

@Controller('like-pin')
export class LikePinController {
  constructor(private likePinService: LikePinService) {}

  @Get('/pin/:id')
  getLikeOfPin(@Param('id') id: number) {
    return this.likePinService.getLikePin(+id);
  }

  @Post()
  newLike(@Body() body: { pinId: number; userId: number }) {
    return this.likePinService.createNewLike(body.pinId, body.userId);
  }

  @Delete()
  deleteALike(@Body() body: { userId: number; pinId: number }) {
    return this.likePinService.deleteALike(body.pinId, body.userId);
  }
}
