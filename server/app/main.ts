import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/errors/app.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 모든 라우트 앞에 /api 붙음
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // 비밀번호 안보이기 얍!
  
  app.enableCors({
    origin: '*', // 개발 중에는 전체 허용, 배포 시 도메인 지정
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
}

void bootstrap();
