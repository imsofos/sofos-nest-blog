import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsMicroserviceAppService {

  getAnalytics() {
    return ['analytics'];
  }

}
