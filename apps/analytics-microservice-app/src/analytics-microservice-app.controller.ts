import { Controller } from '@nestjs/common';
import { AnalyticsMicroserviceAppService } from './analytics-microservice-app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AnalyticsMicroserviceAppController {
  constructor(private readonly analyticsMicroserviceAppService: AnalyticsMicroserviceAppService) { }

  @MessagePattern({ cmd: 'analytics' })
  getAnalytics() {
    return this.analyticsMicroserviceAppService.getAnalytics();
  }

  @EventPattern('user_created')
  async handleUserCreated(data: Record<string, unknown>) {
    console.log('user_created OK.', data)
  }
}
