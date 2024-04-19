import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Test changes inside instance EC2 for video");
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
