import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreatePetSchema, type CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetSchema, type UpdatePetDto } from './dto/update-pet.dto';

interface AuthRequest {
  user: { id: string; email: string; role: string };
}

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Get()
  findMyPets(@Request() req: AuthRequest) {
    return this.petsService.findMyPets(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreatePetSchema)) dto: CreatePetDto,
    @Request() req: AuthRequest,
  ) {
    return this.petsService.create(dto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePetSchema)) dto: UpdatePetDto,
    @Request() req: AuthRequest,
  ) {
    return this.petsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.petsService.remove(id, req.user.id);
  }
}