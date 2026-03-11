import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthRequest {
  user: { id: string; email: string; role: string };
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  // 채팅방 생성 또는 기존 방 반환
  @Post('rooms')
  getOrCreateRoom(
    @Body() body: { groomerId: string },
    @Request() req: AuthRequest,
  ) {
    return this.chatService.getOrCreateRoom(req.user.id, body.groomerId);
  }

  // 내 채팅방 목록
  @Get('rooms')
  findMyRooms(@Request() req: AuthRequest) {
    return this.chatService.findMyRooms(req.user.id);
  }

  // 채팅방 메시지 히스토리
  @Get('rooms/:roomId/messages')
  findMessages(@Param('roomId') roomId: string) {
    return this.chatService.findMessages(roomId);
  }

  // 읽음 처리
  @Post('rooms/:roomId/read')
  markAsRead(
    @Param('roomId') roomId: string,
    @Request() req: AuthRequest,
  ) {
    return this.chatService.markAsRead(roomId, req.user.id);
  }
}