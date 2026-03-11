import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Pet } from 'app/pets/pet.entity';
import { Groomer } from 'app/groomers/groomer.entity';
import { NotificationsService } from 'app/notifications/notifications.service';
import { forbiddenError, notFoundError } from 'app/common/errors/app.error';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    private notificationsService: NotificationsService,
  ) {}

  // 예약 생성
  async create(dto: CreateReservationDto, _userId: string) {
    const reservation = new Reservation();
    reservation.pet = { id: dto.petId } as Pet;
    reservation.groomer = { id: dto.groomerId } as Groomer;
    reservation.date = dto.date;
    reservation.startTime = dto.startTime;
    reservation.endTime = dto.endTime;
    reservation.serviceType = dto.serviceType;
    reservation.memo = dto.memo ?? null;
    reservation.status = 'pending';
    const saved = await this.reservationRepo.save(reservation);

    // 미용사에게 새 예약 알림
    const groomer = await this.reservationRepo.findOne({
      where: { id: saved.id },
      relations: ['groomer', 'groomer.user', 'pet'],
    });

    const groomerPushToken = groomer?.groomer.user.pushToken;
    if (groomerPushToken) {
      await this.notificationsService.sendPushNotification(
        groomerPushToken,
        '새 예약이 들어왔습니다! 🐶',
        `${groomer?.pet.name} 예약 요청이 들어왔습니다.`,
      );
    }

    return saved;
  }

  // 고객 본인 예약 목록 조회
  async findMyReservations(userId: string) {
    return this.reservationRepo.find({
      where: { pet: { owner: { id: userId } } },
      relations: ['pet', 'groomer', 'groomer.user'],
      order: { createdAt: 'DESC' },
    });
  }

  // 미용사 본인 예약 목록 조회
  async findGroomerReservations(userId: string) {
  return this.reservationRepo.find({
    where: { groomer: { user: { id: userId } } },
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

    if (!reservation) throw notFoundError('예약을 찾을 수 없습니다.');
    return reservation;
  }

  // 예약 상태 업데이트 (미용사용)
  async updateStatus(id: string, dto: UpdateReservationDto, userId: string) {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: ['groomer', 'groomer.user', 'pet', 'pet.owner'],
    });
    if (!reservation) throw notFoundError('예약을 찾을 수 없습니다.');
    if (reservation.groomer.user.id !== userId)
      throw forbiddenError('권한이 없습니다.');

    reservation.status = dto.status;
    await this.reservationRepo.save(reservation);

    // 고객에게 푸시 알림 전송
    const ownerPushToken = reservation.pet.owner.pushToken;
    if (ownerPushToken) {
      const messages: Record<string, { title: string; body: string }> = {
        confirmed: {
          title: '예약이 확정되었습니다! 🎉',
          body: `${reservation.groomer.shopName} 예약이 확정되었습니다.`,
        },
        cancelled: {
          title: '예약이 취소되었습니다.',
          body: `${reservation.groomer.shopName} 예약이 취소되었습니다.`,
        },
        done: {
          title: '시술이 완료되었습니다! 🐾',
          body: `${reservation.pet.name}의 미용이 완료되었습니다.`,
        },
      };

      const message = messages[dto.status];
      if (message) {
        await this.notificationsService.sendPushNotification(
          ownerPushToken,
          message.title,
          message.body,
        );
      }
    }

    return reservation;
  }

  // 예약 취소 (고객용)
  async cancel(id: string, userId: string) {
    const reservation = await this.findOne(id);

    if (reservation.pet.owner.id !== userId)
      throw forbiddenError('권한이 없습니다.');

    reservation.status = 'cancelled';
    return this.reservationRepo.save(reservation);
  }
}
