import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters/http.exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = 'api/v1';
  const reflector = app.get(Reflector);

  app.enableCors();
  app.setGlobalPrefix(prefix);
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));


  const config = new DocumentBuilder()
    .setTitle('Food Tourism API')
    .setDescription('Tài liệu hướng dẫn sử dụng các API hệ thống đặc sản & quán ăn')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Bạn có thể truy cập tài liệu tại: http://localhost:8080/api/v1/docs
  SwaggerModule.setup('api/v1/docs', app, document);
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');


  Logger.log(` Application is running on: http://localhost:${process.env.PORT ?? 8080}/${prefix}`, 'Bootstrap');
}
void bootstrap();
