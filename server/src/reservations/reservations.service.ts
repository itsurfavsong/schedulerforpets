import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Pet } from 'src/pets/pet.entity';
import { Groomer } from 'src/groomers/groomer.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
  ) {}

  // 예약 생성
  async create(dto: CreateReservationDto, userId: string) {
    const reservation = this.reservationRepo.create({
      pet: { id: dto.petId } as Pet,
      groomer: { id: dto.groomerId } as Groomer,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      serviceType: dto.serviceType,
      memo: dto.memo,
    });

    return this.reservationRepo.save(reservation);
  }

  // 내 예약 목록 조회
  async findMyReservations(userId: string) {
    return this.reservationRepo.find({
      where: { pet: { owner: { id: userId } } },
      relations: ['pet', 'groomer', 'groomer.user'],
      order: { createdAt: 'DESC' },
    });
  }

  // 예약 단건 조회
  async findOne(id: string) {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: ['pet', 'groomer', 'groomer.user'],
    });

    if (!reservation) throw new NotFoundException('예약을 찾을 수 없습니다.');
    return reservation;
  }

  // 예약 상태 업데이트 (미용사용)
  async updateStatus(id: string, dto: UpdateReservationDto, userId: string) {
    const reservation = await this.findOne(id);

    if (reservation.groomer.user.id !== userId)
      throw new ForbiddenException('권한이 없습니다.');

    reservation.status = dto.status;
    return this.reservationRepo.save(reservation);
  }

  // 예약 취소 (고객용)
  async cancel(id: string, userId: string) {
    const reservation = await this.findOne(id);

    if (reservation.pet.owner.id !== userId)
      throw new ForbiddenException('권한이 없습니다.');

    reservation.status = 'cancelled';
    return this.reservationRepo.save(reservation);
  }
}
