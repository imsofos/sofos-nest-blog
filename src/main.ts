import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JWTFilter } from './common/filters/jwt.filter';
import { CASLFilter } from './common/filters/casl.filter';
import { PrismaFilter } from './common/filters/prisma.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new JWTFilter(), new CASLFilter(), new PrismaFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {prefix: '/uploads/'})
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
