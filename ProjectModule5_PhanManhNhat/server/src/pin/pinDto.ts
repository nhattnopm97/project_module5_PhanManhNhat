import { IsDate, IsString } from 'class-validator';

export class PinDto {
  id?: number;

  link: string;

  title: string;

  description: string;

  tag: string;

  timeupload: Date;

  userId: number;

  status: number;
}
