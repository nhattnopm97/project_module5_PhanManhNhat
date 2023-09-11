import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  avatar?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  url?: string;

  description?: string;

  @IsNotEmpty()
  createdate: Date;

  @IsNotEmpty()
  role: number;

  @IsNotEmpty()
  birthday: Date;
}

export class UserLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserUpdate {
  id?: number;

  name: string;

  password: string;

  avatar?: string;

  email: string;

  url?: string;

  description?: string;

  createdate: Date;

  role: number;

  birthday: Date;
}
