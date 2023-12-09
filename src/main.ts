import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, LogLevel } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const { PORT, LOG_LEVEL } = process.env;
  const app = await NestFactory.create(AppModule, {
    logger: [LOG_LEVEL as LogLevel],
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(PORT);
  logger.log(`Server is running on <http://localhost:${PORT}>`);
  console.log(`Server listen on http://localhost:${PORT}`);
}
bootstrap();
