import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { Groomer } from '../groomers/groomer.entity';
import { Reservation } from '../reservations/reservation.entity';

@Entity('reviews')
export class Review {
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}