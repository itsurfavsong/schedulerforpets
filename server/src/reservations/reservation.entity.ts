import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Pet } from '../pets/pet.entity';
import { Groomer } from '../groomers/groomer.entity';

export type ServiceType = 'bath' | 'cut' | 'full';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'done';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Groomer, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'groomer_id' })
  groomer: Groomer;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ default: 'pending' })
  status: ReservationStatus;

  @Column({ name: 'service_type', default: 'bath' })
  serviceType: ServiceType;

  @Column({ type: 'text', nullable: true })
  memo: string | null | undefined;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
