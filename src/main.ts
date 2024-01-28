import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  app.useGlobalPipes(new ValidationPipe());

  await app
    .listen(PORT)
    .then(() => console.log(`App is running on port ${PORT}`))
    .catch((error: Error) => console.error(error));
}
bootstrap();
