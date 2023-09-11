import { Pin } from '../pin/pin.entity';
import { Users } from '../users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  timecomment: Date;

  @ManyToOne(() => Users, (users) => users.comment)
  users: Users;

  @ManyToOne(() => Pin, (pin) => pin.comment)
  pin: Pin;
}
