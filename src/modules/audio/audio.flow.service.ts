import { InjectFlowProducer } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { FlowProducer } from "bullmq";

@Injectable()
export class AudioFlowService {
    constructor(@InjectFlowProducer('audioFlow') private audioFlowProducer: FlowProducer) { }

    async addFlow() {
        const job = await this.audioFlowProducer.add({
            name: 'parent-job',
            queueName: 'audio',
            data: {},
            children: [
                {
                    name: 'child-job',
                    data: { idx: 0, foo: 'bar' },
                    queueName: 'audio',
                },
                {
                    name: 'child-job',
                    data: { idx: 1, foo: 'bar' },
                    queueName: 'audio',
                },
            ],
        });
        return job
    }
}