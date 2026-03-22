import { HttpStatus } from '@nestjs/common';

export interface IErrorCode {
  code: string;
  message: string;
  httpStatus: HttpStatus;
}