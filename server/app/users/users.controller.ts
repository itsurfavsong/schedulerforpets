import { Controller, Get, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

interface AuthRequest {
  user: { id: string; email: string; role: string };
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: { user: { id: string; email: string; role: string } }) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('push-token')
  @UseGuards(JwtAuthGuard)
  updatePushToken(
    @Body() body: { pushToken: string },
    @Request() req: AuthRequest,
  ) {
    return this.usersService.updatePushToken(req.user.id, body.pushToken);
  }
}
