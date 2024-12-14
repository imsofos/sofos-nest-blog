import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from './modules/casl/casl.module';
import { PostModule } from './modules/post/post.module';
import { PostController } from './modules/post/post.controller';
import { PostService } from './modules/post/post.service';
import { DbModule } from './modules/db/db.module';
import { BullModule } from '@nestjs/bullmq';
import { AudioModule } from './modules/audio/audio.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    CaslModule,
    PostModule,
    DbModule,
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379
      }
    }),
    AudioModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class AppModule { }
