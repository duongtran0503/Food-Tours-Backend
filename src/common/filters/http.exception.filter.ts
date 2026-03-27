import { AppException } from '@/common/exceptions/app.exception';
import { AppConfig } from '@/config/app.config';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Lỗi hệ thống';
    let   timestamp= dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS');

    if (exception instanceof AppException) {
      status = exception.getStatus();
      message = exception.message;
      code = exception.errorCode.toUpperCase(); 
    } else if (exception instanceof HttpException) {
        status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Lấy message chuẩn từ class-validator hoặc từ lỗi hệ thống
      message =
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? (exceptionResponse as any).message || exception.message
          : exception.message;

      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          code = AppConfig.CODES.UNAUTHORIZED;
          message = "Vui lòng đăng nhập để thực hiện hành dộng này"
          break;
        case HttpStatus.FORBIDDEN:
          code = AppConfig.CODES.FORBIDDEN;
          break;
        case HttpStatus.NOT_FOUND:
          code = AppConfig.CODES.NOT_FOUND;
          message = "Không tìm thấy tài nguyên"
          break;
        case HttpStatus.BAD_REQUEST:
          code = Array.isArray(message)
            ? AppConfig.CODES.VALIDATION_ERROR
            : AppConfig.CODES.BAD_REQUEST;
          break;
      }
    }else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      code: code,
      message: message,
      timestamp
    });
  }
}