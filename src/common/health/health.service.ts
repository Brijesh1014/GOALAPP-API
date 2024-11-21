import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async checkSystemHealth() {
    return {
      success: true,
      timestamp: new Date(),
    };
  }
}
