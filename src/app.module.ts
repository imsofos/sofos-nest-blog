import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from './modules/casl/casl.module';
import { PostModule } from './modules/post/post.module';
import { DbModule } from './modules/db/db.module';
import { BullModule } from '@nestjs/bullmq';
import { AudioModule } from './modules/audio/audio.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register(),
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
    AudioModule,
    ChatModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }
  ]
})
export class AppModule { }
