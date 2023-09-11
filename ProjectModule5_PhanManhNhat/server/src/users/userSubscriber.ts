import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Subcriber {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.subscribers)
  userSubcriber: Users;

  @ManyToOne(() => Users, (users) => users.subscribedTo)
  userSubcribed: Users;
}
