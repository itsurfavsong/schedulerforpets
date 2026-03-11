import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { GroomersService } from './groomers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateGroomerSchema, type CreateGroomerDto } from './dto/create-groomer.dto';
import { UpdateGroomerSchema, type UpdateGroomerDto } from './dto/update-groomer.dto';

interface AuthRequest {
  user: { id: string; email: string; role: string };
}

@Controller('groomers')
export class GroomersController {
  constructor(private groomersService: GroomersService) {}

  // 전체 목록 (Everyone)
  @Get()
  findAll() {
    return this.groomersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groomersService.findOne(id);
  }

  // 프로필 조회 (Groomer)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyProfile(@Request() req: AuthRequest) {
    return this.groomersService.findMyProfile(req.user.id);
  }

  // 프로필 수정 (Groomer)
  @Put('me')
    @UseGuards(JwtAuthGuard)
    updateMyProfile(
        @Body(new ZodValidationPipe(UpdateGroomerSchema)) dto: UpdateGroomerDto,
        @Request() req: AuthRequest,
    ) {
        return this.groomersService.updateMyProfile(req.user.id, dto);
    }

  // 프로필 생성 (Groomer)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(new ZodValidationPipe(CreateGroomerSchema)) dto: CreateGroomerDto,
    @Request() req: AuthRequest,
  ) {
    return this.groomersService.create(dto, req.user.id);
  }

  // 프로필 삭제 (Admin)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.groomersService.remove(id, req.user.id);
  }
}