import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";

@Injectable()
export class AudioService {
    constructor(@InjectQueue('audio') private readonly audioQueue: Queue) { }

    async addJob(name: string, data: any): Promise<Job> {
        const result = this.audioQueue.add(name, data);
        return result;
    }
}