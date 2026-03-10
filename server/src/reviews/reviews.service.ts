import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { type CreateReviewDto } from './dto/create-review.dto';
import { type UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/user.entity';
import { Groomer } from 'src/groomers/groomer.entity';
import { Reservation } from 'src/reservations/reservation.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto, userId: string) {
    const exists = await this.reviewRepo.findOne({
      where: { reservation: { id: dto.reservationId } },
    });
    if (exists) throw new ConflictException('이미 리뷰를 작성했습니다.');

    const review = new Review();
    review.author = { id: userId } as User;
    review.groomer = { id: dto.groomerId } as Groomer;
    review.reservation = { id: dto.reservationId } as Reservation;
    review.rating = dto.rating;
    review.comment = dto.comment ?? null;
    review.reviewedAt = new Date();

    return this.reviewRepo.save(review);
  }

  async update(id: string, dto: UpdateReviewDto, userId: string) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    if (review.author.id !== userId) throw new ForbiddenException('권한이 없습니다.');

    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;

    return this.reviewRepo.save(review);
  }

  // Soft Delete - DB에는 남고 deleted_at만 찍힘
  async remove(id: string, userId: string) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    if (review.author.id !== userId) throw new ForbiddenException('권한이 없습니다.');

    await this.reviewRepo.softRemove(review); // 👈 softRemove!
    return { message: '리뷰가 삭제되었습니다.' };
  }

  async findByGroomer(groomerId: string) {
    return this.reviewRepo.find({
      where: { groomer: { id: groomerId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      // deleted_at IS NULL 인 것만 자동으로 반환!
    });
  }

  async getAverageRating(groomerId: string) {
    const result = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.groomer_id = :groomerId', { groomerId })
      .andWhere('review.deleted_at IS NULL') // 삭제된 리뷰 제외
      .getRawOne() as { average: string; count: string };

    return {
      average: result.average ? parseFloat(parseFloat(result.average).toFixed(1)) : 0,
      count: parseInt(result.count, 10),
    };
  }
}