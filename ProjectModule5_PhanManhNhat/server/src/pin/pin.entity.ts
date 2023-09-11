import { Comment } from '../comment/comment.entity';
import { Users } from '../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// import { Exclude } from 'class-transformer';
@Entity()
export class Pin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext', { nullable: true })
  link: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  tag: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  timeupload: Date;

  @ManyToOne(() => Users, (users) => users.pin)
  users: Users;

  @OneToMany(() => Comment, (comment) => comment.users)
  comment: Comment;
}
