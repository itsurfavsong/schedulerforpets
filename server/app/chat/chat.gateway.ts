import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // 접속 중인 유저 관리 (userId → socketId)
  private connectedUsers = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  // 연결 시
  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;
      const payload = this.jwtService.verify<JwtPayload>(token);
      client.data.userId = payload.sub;
      this.connectedUsers.set(payload.sub, client.id);
      console.log(`✅ 연결됨: ${payload.sub}`);
    } catch {
      console.log('❌ 인증 실패 - 연결 끊음');
      client.disconnect();
    }
  }

  // 연결 해제 시
  handleDisconnect(client: Socket) {
    const userId = client.data.userId as string;
    this.connectedUsers.delete(userId);
    console.log(`❌ 연결 해제: ${userId}`);
  }

  // 채팅방 입장
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.join(roomId);

    // 읽음 처리
    const userId = client.data.userId as string;
    await this.chatService.markAsRead(roomId, userId);

    client.emit('joined_room', roomId);
  }

  // 메시지 전송
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string },
  ) {
    const userId = client.data.userId as string;

    // DB 저장
    const message = await this.chatService.saveMessage(
      data.roomId,
      userId,
      data.content,
    );

    // 같은 방 모든 유저에게 전송
    this.server.to(data.roomId).emit('new_message', {
      id: message.id,
      content: message.content,
      senderId: userId,
      sentAt: message.sentAt,
    });
  }

  // 채팅방 나가기
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.leave(roomId);
    client.emit('left_room', roomId);
  }
}