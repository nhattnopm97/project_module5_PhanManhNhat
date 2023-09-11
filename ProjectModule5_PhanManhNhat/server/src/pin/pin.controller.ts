import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { PinService } from './pin.service';
import { Pin } from './pin.entity';
import { PinDto } from './pinDto';

@Controller('pin')
export class PinController {
  constructor(private pinService: PinService) {}
  @Get()
  getAll() {
    return this.pinService.findAll();
  }

  @Get('/relate/:id')
  getPinRelate(@Param('id') id: number) {
    return this.pinService.findPinRelate(+id);
  }

  @Get('/user/:id')
  getPinInClt(@Param('id') id: number) {
    console.log(id);
    return this.pinService.findPinIntoCollection(+id);
  }

  @Get('/pinofuser/:id')
  findPinOfUser(@Param('id') id: number) {
    return this.pinService.findPinOfUser(+id);
  }

  @Get('/detail/:id')
  getOne(@Param('id') id: number) {
    console.log('id', id);
    return this.pinService.findOne(+id);
  }

  @Get('/collectionPin/:id')
  getPinIntoCollection(@Param('id') id: number) {
    return this.pinService.findPinInCollectionByCollectionId(+id);
  }

  @Post('/intoCollection')
  addIntoCollection(@Body() body) {
    let pinId = body.pinId;
    let collectionId = body.collectionId;
    let userId = body.userId;
    return this.pinService.saveIntoCollection(pinId, collectionId, userId);
  }

  @Post()
  async createANewPin(@Body() pinDto: PinDto) {
    // Get the user from the database using userId or create a new user if needed
    console.log(pinDto);
    const user = await this.pinService.findUserById(pinDto.userId); // Replace 'findUserById' with your actual method to find a user by id or create a new user

    // Create a new Pin object and set its properties
    const newPin = new Pin();
    newPin.link = pinDto.link;
    newPin.title = pinDto.title;
    newPin.description = pinDto.description;
    newPin.tag = pinDto.tag;
    newPin.timeupload = new Date();
    newPin.users = user; // Assign the user to the pin
    newPin.status = pinDto.status;
    // Save the new pin
    return this.pinService.create(newPin);
  }

  @Delete('/removePinFromCollection')
  removePinFromCollection(@Body() body) {
    let pinId = body.pinId;
    let collectionId = body.collectionId;
    let userId = body.userId;
    return this.pinService.removePinFromCollection(pinId, collectionId, userId);
  }

  @Delete()
  deletePinOfUser(@Body() body: { userId: number; pinId: number }) {
    return this.pinService.deletePin(+body.pinId, +body.userId);
  }
}
