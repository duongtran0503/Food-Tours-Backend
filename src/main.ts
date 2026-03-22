import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters/http.exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = 'api/v1';
  const reflector = app.get(Reflector);
  app.setGlobalPrefix(prefix);
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               
    forbidNonWhitelisted: true,   
    transform: true,               
  }));
  await app.listen(process.env.PORT ?? 8080);


  Logger.log(` Application is running on: http://localhost:${process.env.PORT ?? 8080}/${prefix}`, 'Bootstrap');
}
void bootstrap();
