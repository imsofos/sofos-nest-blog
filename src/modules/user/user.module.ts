import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CaslModule } from '../casl/casl.module';
import { DbModule } from '../db/db.module';

@Module({
  imports: [CaslModule, DbModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
