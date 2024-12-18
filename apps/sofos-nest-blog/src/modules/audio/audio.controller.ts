import { Controller, Get } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioFlowService } from './audio.flow.service';

@Controller('audio')
export class AudioController {
    constructor(
        private readonly audioService: AudioService,
        private readonly audioFlowService: AudioFlowService
    ) { }

    @Get()
    async addJobs() {
        const result = await this.audioService.addJob('jobName', { field: 'value' });
        return result;
    }

    @Get('flow')
    async addFlow() {
        const result = await this.audioFlowService.addFlow();
        return result;
    }
}
