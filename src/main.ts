import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Test changes on repo inside EC2 plus docker build");
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
