import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
@Processor('audio')
export class AudioConsumer extends WorkerHost {

    async process(job: Job, token?: string): Promise<any> {
        console.log(token, job.name, job.data);
    }

}
