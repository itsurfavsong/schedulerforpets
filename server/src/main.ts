import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 모든 라우트 앞에 /api 붙음
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // 비밀번호 안보이기 얍!
  await app.listen(3000);
}

void bootstrap();
