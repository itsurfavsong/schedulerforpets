import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from 'app/common/base.entity';

export type PetGender = 'male' | 'female';

@Entity('pets')
export class Pet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 100 })
  breed: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: PetGender | null;
  
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;
  
  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;
}
