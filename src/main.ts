import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { PostgresExceptionFilter } from './common/exceptions/postgres-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new PostgresExceptionFilter());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     exceptionFactory(errors) {
  //       throw new BadRequestException(errors);
  //     },
  //   }),
  // );

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
