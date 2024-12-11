import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JWTFilter } from './common/filters/jwt.filter';
import { CASLFilter } from './common/filters/casl.filter';
import { PrismaFilter } from './common/filters/prisma.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new JWTFilter(), new CASLFilter(), new PrismaFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
