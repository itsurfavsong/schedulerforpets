import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/ko';
import { User } from '../users/user.entity';
import { Pet } from '../pets/pet.entity';
import { Groomer } from '../groomers/groomer.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const petRepo = app.get<Repository<Pet>>(getRepositoryToken(Pet));
  const groomerRepo = app.get<Repository<Groomer>>(getRepositoryToken(Groomer));

  // 고객 5명 생성
  for (let i = 0; i < 5; i++) {
    const user = userRepo.create({
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      password: await bcrypt.hash('123456', 10),
      role: 'customer',
    });
    const savedUser = await userRepo.save(user);

    // 고객마다 펫 1~2마리
    const petCount = faker.number.int({ min: 1, max: 2 });
    for (let j = 0; j < petCount; j++) {
      const pet = petRepo.create({
        owner: savedUser,
        name: faker.person.firstName(),
        breed: faker.helpers.arrayElement(['말티즈', '푸들', '시츄', '포메라니안', '골든리트리버']),
        weight: parseFloat(faker.number.float({ min: 1, max: 15 }).toFixed(1)),
        age: faker.number.int({ min: 1, max: 10 }),
        notes: faker.helpers.arrayElement(['예민함', '활발함', '온순함', null]),
      });
      await petRepo.save(pet);
    }
  }

  // 미용사 3명 생성
  for (let i = 0; i < 3; i++) {
    const user = userRepo.create({
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      password: await bcrypt.hash('123456', 10),
      role: 'groomer',
    });
    const savedUser = await userRepo.save(user);

    const groomer = groomerRepo.create({
      user: savedUser,
      shopName: `${faker.location.city()} 애견미용실`,
      address: faker.location.streetAddress(),
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
    });
    await groomerRepo.save(groomer);
  }

  console.log('✅ 시드 데이터 생성 완료!');
  await app.close();
}

void seed();