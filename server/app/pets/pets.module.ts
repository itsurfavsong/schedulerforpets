import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet.entity';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { UploadService } from 'app/common/upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pet])],
  controllers: [PetsController],
  providers: [PetsService, UploadService],
})
export class PetsModule {}