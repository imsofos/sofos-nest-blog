import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { DbModule } from '../db/db.module';
import { CaslModule } from '../casl/casl.module';

@Module({
    imports: [DbModule, CaslModule],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule { }
