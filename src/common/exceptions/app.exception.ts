import { HttpException } from '@nestjs/common';
import { IErrorCode } from '@/common/interfaces/error-code.interface';

export class AppException extends HttpException {
  public readonly errorCode: string;

  constructor(error: IErrorCode) {
    super(error.message, error.httpStatus);
    this.errorCode = error.code;
  }
}