import { AppModule } from '@/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = 'api/v1';
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               
    forbidNonWhitelisted: true,   
    transform: true,               
  }));
  await app.listen(process.env.PORT ?? 3000);


  Logger.log(` Application is running on: http://localhost:${process.env.PORT ?? 3000}/${prefix}`, 'Bootstrap');
}
void bootstrap();
