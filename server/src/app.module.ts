import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { PetsModule } from './pets/pets.module';
import { GroomersModule } from './groomers/groomers.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // 1. 환경변수 전역 로드
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. DB 연결
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 개발 중에만 true, 배포 시 반드시 false!
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PetsModule,
    GroomersModule,
    ReservationsModule,
    ReviewsModule,
  ],
})
export class AppModule {}
