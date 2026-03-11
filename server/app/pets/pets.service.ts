import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { forbiddenError, notFoundError } from 'app/common/errors/app.error';
import { User } from 'app/users/user.entity';
import { UploadService } from 'app/common/upload/upload.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petRepo: Repository<Pet>,
    private uploadService: UploadService,
  ) {}

  // 내 펫 목록 조회
  async findMyPets(userId: string) {
    return this.petRepo.find({
      where: { owner: { id: userId } },
    });
  }

  // 펫 단건 조회
  async findOne(id: string) {
    const pet = await this.petRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!pet) throw notFoundError('반려견을 찾을 수 없습니다.');
    return pet;
  }

  // 펫 등록
  async create(dto: CreatePetDto, userId: string) {
    const pet = new Pet();
    pet.owner = { id: userId } as User;
    pet.name = dto.name;
    pet.breed = dto.breed;
    pet.gender = dto.gender;
    pet.weight = dto.weight;
    pet.age = dto.age;
    pet.notes = dto.notes ?? null;
    return this.petRepo.save(pet);
  }

  // 펫 수정
  async update(id: string, dto: UpdatePetDto, userId: string) {
    const pet = await this.findOne(id);
    if (pet.owner.id !== userId) throw forbiddenError('권한이 없습니다.');

    if (dto.name) pet.name = dto.name;
    if (dto.breed !== undefined) pet.breed = dto.breed;
    if (dto.weight !== undefined) pet.weight = dto.weight;
    if (dto.age !== undefined) pet.age = dto.age;
    if (dto.notes !== undefined) pet.notes = dto.notes ?? null;

    return this.petRepo.save(pet);
  }

  // 펫 삭제
  async remove(id: string, userId: string) {
    const pet = await this.findOne(id);
    if (pet.owner.id !== userId) throw forbiddenError('권한이 없습니다.');
    await this.petRepo.remove(pet);
    return { message: '반려견이 삭제되었습니다.' };
  }

  async uploadImage(id: string, file: Express.Multer.File, userId: string) {
    const pet = await this.petRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!pet) throw notFoundError('펫을 찾을 수 없습니다.');
    if (pet.owner.id !== userId) throw forbiddenError('권한이 없습니다.');

    const url = await this.uploadService.uploadImage(file, 'pets');
    pet.avatarUrl = url;
  return this.petRepo.save(pet);
}
}