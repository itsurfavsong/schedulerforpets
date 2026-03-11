import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AppError } from 'app/common/errors/app.error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new AppError('유저를 찾을 수 없습니다.');

    const { password, ...result } = user;
    return result;
  }

  async updatePushToken(userId: string, pushToken: string) {
    await this.userRepo.update(userId, { pushToken });
    return { message: 'Push token 저장 완료!' };
  }
}
