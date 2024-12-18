import { NestFactory } from '@nestjs/core';
import { AnalyticsMicroserviceAppModule } from './analytics-microservice-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnalyticsMicroserviceAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 4000
      }
    }
  );
  await app.listen();
}
bootstrap();
