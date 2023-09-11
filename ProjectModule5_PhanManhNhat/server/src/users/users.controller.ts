import { CreateUserDto, UserLogin, UserUpdate } from './userDto';
import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  BadGatewayException,
} from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.UsersService.register(user);
  }

  @Post('login')
  login(@Body() user: UserLogin) {
    return this.UsersService.login(user);
  }

  @Post('/subcriber/create')
  createSubcriber(
    @Body() body: { subscriberId: number; subscribedId: number },
  ) {
    if (+body.subscriberId === +body.subscribedId) {
      throw new BadGatewayException('Không thể đăng ký chính mình');
    } else {
      return this.UsersService.createSubcriber(
        +body.subscriberId,
        +body.subscribedId,
      );
    }
  }

  @Get()
  getAll() {
    return this.UsersService.findAll();
  }

  @Get('/subcriber/:id')
  getSubcriber(@Param('id') id: number) {
    return this.UsersService.getSubcriber(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/detail/:id')
  getOne(@Param('id') id: number) {
    return this.UsersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put()
  updateUser(@Body() user: UserUpdate) {
    console.log(user);
    return this.UsersService.updateUser(user);
  }

  @Delete('/subcriber/:id')
  async deleteSubcriber(@Param('id') id: number) {
    return this.UsersService.unSubcriber(id);
  }
}
