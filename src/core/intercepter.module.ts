import { Module } from '@nestjs/common';
import { IntercepterController } from './intercepter.controller';

@Module({
  controllers: [IntercepterController],
})
export class IntercepterModule {}
