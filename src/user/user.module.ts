import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FeishuService } from './feishu/feishu.service';
import { FeishuController } from './feishu/feishu.controller';
import { DatabaseModule } from '@/common/database/database.module';
import { UserProviders } from './user.providers';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [UserController, FeishuController],
  providers: [UserService, FeishuService, ...UserProviders],
  exports: [UserService],
})
export class UserModule {}

