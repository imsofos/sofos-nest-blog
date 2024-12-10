import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JWTFilter } from './common/filters/jwt.filter';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new JWTFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
