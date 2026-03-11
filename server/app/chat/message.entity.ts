import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ChatRoom } from './chat-room.entity';
import { BaseEntity } from 'app/common/base.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: ChatRoom;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'sent_at', type: 'timestamptz', default: () => 'NOW()' })
  sentAt: Date;
}