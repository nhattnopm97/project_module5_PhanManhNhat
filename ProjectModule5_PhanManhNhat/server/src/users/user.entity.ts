import { Collection } from './../collection/collection.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Pin } from 'src/pin/pin.entity';
import { Comment } from 'src/comment/comment.entity';
import { Subcriber } from './userSubscriber';
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  createdate: Date;

  @Column()
  role: number;

  @Column()
  birthday: Date;

  @OneToMany(() => Pin, (pin) => pin.users)
  pin: Pin[];

  @OneToMany(() => Collection, (collection) => collection.users)
  collection: Collection[];

  @OneToMany(() => Comment, (comment) => comment.users)
  comment: Comment[];

  @ManyToMany(() => Comment)
  @JoinTable()
  love: Comment[];

  @OneToMany(() => Subcriber, (subscribe) => subscribe.userSubcriber)
  subscribers: Subcriber[];

  @OneToMany(() => Subcriber, (subscribe) => subscribe.userSubcribed)
  subscribedTo: Subcriber[];
}
