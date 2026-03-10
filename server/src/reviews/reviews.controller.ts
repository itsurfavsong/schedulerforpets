import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateReviewSchema } from './dto/create-review.dto';
import type { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewSchema } from './dto/update-review.dto';
import type { UpdateReviewDto } from './dto/update-review.dto';

interface AuthRequest {
  user: { id: string; email: string; role: string };
}

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(new ZodValidationPipe(CreateReviewSchema)) dto: CreateReviewDto,
    @Request() req: AuthRequest,
  ) {
    return this.reviewsService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateReviewSchema)) dto: UpdateReviewDto,
    @Request() req: AuthRequest,
  ) {
    return this.reviewsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.reviewsService.remove(id, req.user.id);
  }

  @Get('groomer/:groomerId')
  findByGroomer(@Param('groomerId') groomerId: string) {
    return this.reviewsService.findByGroomer(groomerId);
  }

  @Get('groomer/:groomerId/rating')
  getAverageRating(@Param('groomerId') groomerId: string) {
    return this.reviewsService.getAverageRating(groomerId);
  }
}