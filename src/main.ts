import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastify from 'fastify';
import {
  VERSION_NEUTRAL,
  VersioningType,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { generateDocument } from './doc';
import { FastifyLogger } from './common/logger';

declare const module: any;

async function bootstrap() {
  // 日志
  const fastifyInstance = fastify({
    logger: FastifyLogger,
  });

  // const app = await NestFactory.create(AppModule);
  // Fastify 与其他主流 HTTP 框架对比，其在 QPS(并发处理请求)的效率上要远超其他框架，
  // 达到了几乎两倍的基准测试结果，所以在网关系统这个对性能要求非常高的项目中使用 Fastify 无疑是一种非常好的选择。
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  );

  // 统一响应式格式
  app.useGlobalInterceptors(new TransformInterceptor());

  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 接口版本化管理
  app.enableVersioning({
    // defaultVersion: '1',
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
    type: VersioningType.URI,
  });

  // 启动全局字段校验，保证请求接口字段校验正确
  app.useGlobalPipes(new ValidationPipe());

  // 创建文档
  generateDocument(app);

  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}

bootstrap();
