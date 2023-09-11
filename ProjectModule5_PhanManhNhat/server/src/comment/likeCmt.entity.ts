import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class LikeComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment)
  @JoinColumn()
  comment: Comment;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;
}
