import { AppConfig } from '@/config/app.config';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE } from '@/common/decorator/message.response';

export interface SuccessResponse<T> {
  data: T;
  code: string; 
  message: string;
  timestamp: string;
}
dayjs.extend(utc);
dayjs.extend(timezone);
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
    constructor(private reflector:Reflector){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {

    const customMessage = this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler());
    return next.handle().pipe(
      map((data) => ({
        data: data ?? [],
        code: AppConfig.CODES.SUCCESS, 
        message:customMessage || 'Thành công',
       timestamp: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      })),
    );
  }
}