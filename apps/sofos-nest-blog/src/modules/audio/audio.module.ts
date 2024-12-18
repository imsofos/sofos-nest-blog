import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioConsumer } from './audio.consumer';
import { AudioService } from './audio.service';
import { AudioFlowService } from './audio.flow.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'audio'
        }),
        BullModule.registerFlowProducer({
            name: 'audioFlow'
        }),
    ],
    providers: [AudioConsumer, AudioService, AudioFlowService],
    controllers: [AudioController]
})
export class AudioModule { }
