import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { Message } from './message.entity';
import { type User } from 'app/users/user.entity';
import { notFoundError } from 'app/common/errors/app.error';
import { Groomer } from 'app/groomers/groomer.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepo: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(Groomer)
    private groomerRepo: Repository<Groomer>,
  ) {}

  // 채팅방 생성 또는 기존 방 반환
  async getOrCreateRoom(customerId: string, groomerId: string) {
    // groomerId로 groomer의 user.id 찾기
    const groomer = await this.groomerRepo.findOne({
      where: { id: groomerId },
      relations: ['user'],
    });

    if (!groomer) throw notFoundError('미용사를 찾을 수 없습니다.');

    const groomerUserId = groomer.user.id;

    const existing = await this.chatRoomRepo.findOne({
      where: {
        customer: { id: customerId },
        groomer: { id: groomerUserId },
      },
      relations: ['customer', 'groomer'],
    });

    if (existing) return existing;

    const room = new ChatRoom();
    room.customer = { id: customerId } as User;
    room.groomer = { id: groomerUserId } as User;

    return this.chatRoomRepo.save(room);
  }

  // 내 채팅방 목록
  async findMyRooms(userId: string) {
  const rooms = await this.chatRoomRepo.find({
      where: [
        { customer: { id: userId } },
        { groomer: { id: userId } },
      ],
      relations: ['customer', 'groomer'],
      order: { createdAt: 'DESC' },
    });

    // groomer user id로 groomer 프로필 찾아서 shopName 추가
    return Promise.all(
      rooms.map(async (room) => {
        const groomer = await this.groomerRepo.findOne({
          where: { user: { id: room.groomer.id } },
        });

        // 마지막 메시지
      const lastMessage = await this.messageRepo.findOne({
        where: { room: { id: room.id } },
        order: { sentAt: 'DESC' },
      });

      // 안읽은 메시지 수
      const unreadCount = await this.messageRepo.count({
        where: {
          room: { id: room.id },
          isRead: false,
          sender: { id: userId === room.customer.id ? room.groomer.id : room.customer.id },
        },
      });

        return {
          ...room,
          groomer: {
            ...room.groomer,
            shopName: groomer?.shopName ?? room.groomer.name,
          },
          lastMessage: lastMessage?.content ?? null,
          lastMessageAt: lastMessage?.sentAt ?? null,
          unreadCount,
        };
      }),
    );
  }

  // 채팅방 메시지 히스토리
  async findMessages(roomId: string) {
    return this.messageRepo.find({
      where: { room: { id: roomId } },
      relations: ['sender'],
      order: { sentAt: 'ASC' },
    });
  }

  // 메시지 저장
  async saveMessage(roomId: string, senderId: string, content: string) {
    const message = new Message();
    message.room = { id: roomId } as ChatRoom;
    message.sender = { id: senderId } as User;
    message.content = content;

    return this.messageRepo.save(message);
  }

  // 메시지 읽음 처리
  async markAsRead(roomId: string, userId: string) {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('room_id = :roomId', { roomId })
      .andWhere('sender_id != :userId', { userId })
      .andWhere('is_read = false')
      .execute();
  }

  // 안읽은 메시지 수
  async getUnreadCount(roomId: string, userId: string) {
    return this.messageRepo.count({
      where: {
        room: { id: roomId },
        isRead: false,
        sender: { id: userId },
      },
    });
  }
}