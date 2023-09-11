import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pin } from '../pin/pin.entity';
import { Users } from '../users/user.entity';

@Entity()
export class UserLikePin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pin)
  @JoinColumn()
  pin: Pin;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;
}
