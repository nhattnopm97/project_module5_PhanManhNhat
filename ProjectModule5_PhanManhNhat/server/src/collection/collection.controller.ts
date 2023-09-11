import { CollectionService } from './collection.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';

@Controller('collection')
export class CollectionController {
  constructor(private CollectionService: CollectionService) {}

  @Post()
  addToCollection(@Body() body) {
    return this.CollectionService.addToCollection(body);
  }

  @Get()
  getAll() {
    return this.CollectionService.getAll();
  }

  @Get('/pinincollection/:id')
  getPinInClt(@Param('id') id: number) {
    return this.CollectionService.getPinInCollection(+id);
  }

  @Put('/:id')
  getCollectionById(@Param('id') id: number) {
    return this.CollectionService.getCollectionById(+id);
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.CollectionService.getOne(+id);
  }
}
