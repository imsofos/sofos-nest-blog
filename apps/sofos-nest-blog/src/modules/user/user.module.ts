import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CaslModule } from '../casl/casl.module';
import { DbModule } from '../db/db.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CaslModule,
    DbModule,
    ClientsModule.register([
      {
        name: 'ANALYTICS',
        transport: Transport.TCP,
        options: {
          port: 4000
        }
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
