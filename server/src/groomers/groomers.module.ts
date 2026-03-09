import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groomer } from './groomer.entity';
import { GroomersController } from './groomers.controller';
import { GroomersService } from './groomers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Groomer])],
  controllers: [GroomersController],
  providers: [GroomersService],
})
export class GroomersModule {}