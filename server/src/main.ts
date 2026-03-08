import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 모든 라우트 앞에 /api 붙음
  await app.listen(3000);
}

void bootstrap();
