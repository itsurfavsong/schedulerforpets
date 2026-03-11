import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreatePetSchema, type CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetSchema, type UpdatePetDto } from './dto/update-pet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/upload/multer.config';
import { UploadedFile } from '@nestjs/common';
import { badRequestError } from 'app/common/errors/app.error';

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

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadPetImage(
    @Param('id') petId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthRequest,
  ) {
    if (!file) throw badRequestError('이미지 파일이 없습니다.');
    return this.petsService.uploadImage(petId, file, req.user.id);
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