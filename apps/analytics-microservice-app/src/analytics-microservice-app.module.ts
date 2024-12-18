import { Module } from '@nestjs/common';
import { AnalyticsMicroserviceAppController } from './analytics-microservice-app.controller';
import { AnalyticsMicroserviceAppService } from './analytics-microservice-app.service';

@Module({
  imports: [],
  controllers: [AnalyticsMicroserviceAppController],
  providers: [AnalyticsMicroserviceAppService],
})
export class AnalyticsMicroserviceAppModule {}
