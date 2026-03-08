import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groomer } from './groomer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Groomer])],
  exports: [TypeOrmModule],
})
export class GroomersModule {}
