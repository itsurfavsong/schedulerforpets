import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateReservationSchema,
  type CreateReservationDto,
} from './dto/create-reservation.dto';
import {
  UpdateReservationSchema,
  type UpdateReservationDto,
} from './dto/update-reservation.dto';

interface AuthRequest {
  user: { id: string; email: string; role: string };
}

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateReservationSchema))
    dto: CreateReservationDto,
    @Request() req: AuthRequest,
  ) {
    return this.reservationsService.create(dto, req.user.id);
  }

  @Get('me')
  findMyReservations(@Request() req: AuthRequest) {
    return this.reservationsService.findMyReservations(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateReservationSchema))
    dto: UpdateReservationDto,
    @Request() req: AuthRequest,
  ) {
    return this.reservationsService.updateStatus(id, dto, req.user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.reservationsService.cancel(id, req.user.id);
  }
}
