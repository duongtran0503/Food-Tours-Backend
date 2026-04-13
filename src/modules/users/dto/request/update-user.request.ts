import { PartialType } from '@nestjs/swagger';
import { CreateUserRequest } from './create-user.request';

// PartialType giúp kế thừa các trường từ CreateUserRequest nhưng biến tất cả thành Optional
export class UpdateUserRequest extends PartialType(CreateUserRequest) {}