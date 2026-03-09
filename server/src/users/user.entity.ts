import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export type UserRole = 'customer' | 'groomer' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'customer' })
  role: UserRole;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
