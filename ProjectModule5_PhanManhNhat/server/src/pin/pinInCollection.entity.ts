import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pin } from './pin.entity';
import { Collection } from '../collection/collection.entity';

@Entity()
export class PinInCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pin)
  @JoinColumn()
  pin: Pin;

  @ManyToOne(() => Collection)
  @JoinColumn()
  collection: Collection;
}
