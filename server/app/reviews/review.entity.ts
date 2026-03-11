import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Groomer } from '../groomers/groomer.entity';
import { Reservation } from '../reservations/reservation.entity';
import { BaseEntity } from 'app/common/base.entity';

@Entity('reviews')
export class Review extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Groomer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groomer_id' })
  groomer: Groomer;

  @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @Column({ type: 'int' })
  rating: number; // 1~5

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamptz', default: () => 'NOW()' })
  reviewedAt: Date;
}