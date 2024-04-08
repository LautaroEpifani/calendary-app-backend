import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Probando cambios para el repositorio de ec2 cambios ip");
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
