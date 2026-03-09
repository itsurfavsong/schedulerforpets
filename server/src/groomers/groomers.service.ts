import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groomer } from './groomer.entity';
import { type CreateGroomerDto } from './dto/create-groomer.dto';
import { type UpdateGroomerDto } from './dto/update-groomer.dto';

@Injectable()
export class GroomersService {
  constructor(
    @InjectRepository(Groomer)
    private groomerRepo: Repository<Groomer>,
  ) {}

  // 미용사 전체 목록 조회 (고객이 검색용)
  async findAll() {
    return this.groomerRepo.find({
      relations: ['user'],
    });
  }

  // 미용사 단건 조회
  async findOne(id: string) {
    const groomer = await this.groomerRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!groomer) throw new NotFoundException('미용사를 찾을 수 없습니다.');
    return groomer;
  }

  // 미용사 프로필 등록
  async create(dto: CreateGroomerDto, userId: string) {
    const exists = await this.groomerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (exists) throw new ConflictException('이미 미용사 프로필이 존재합니다.');

    const groomer = new Groomer();
    groomer.user = { id: userId } as any;
    groomer.shopName = dto.shopName;
    groomer.address = dto.address;
    groomer.bio = dto.bio ?? null;
    groomer.avatarUrl = dto.avatarUrl ?? null;

    return this.groomerRepo.save(groomer);
  }

  // 미용사 프로필 수정
  async update(id: string, dto: UpdateGroomerDto, userId: string) {
    const groomer = await this.findOne(id);
    if (groomer.user.id !== userId) throw new ForbiddenException('권한이 없습니다.');

    groomer.shopName = dto.shopName;
    groomer.address = dto.address;
    groomer.bio = dto.bio ?? null;
    groomer.avatarUrl = dto.avatarUrl ?? null;

    return this.groomerRepo.save(groomer);
  }

  // 미용사 프로필 삭제
  async remove(id: string, userId: string) {
    const groomer = await this.findOne(id);
    if (groomer.user.id !== userId) throw new ForbiddenException('권한이 없습니다.');
    await this.groomerRepo.remove(groomer);
    return { message: '미용사 프로필이 삭제되었습니다.' };
  }
}