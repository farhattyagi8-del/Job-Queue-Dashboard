import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = (globalThis as { process?: { env?: { PORT?: string } } }).process?.env?.PORT || 3001;

  await app.listen(port);
}

bootstrap();