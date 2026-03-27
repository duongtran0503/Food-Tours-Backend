import { Public } from "@/common/decorator/is.public";
import { MessageResponse } from "@/common/decorator/message.response";
import { LoginRequest } from "@/modules/auth/dto/request/login-request";
import { RegisterUserRequest } from "@/modules/auth/dto/request/register-user-request";
import { AuthResponse } from "@/modules/auth/dto/response/auth-response";
import { AuthService } from "@/modules/auth/services/auth.service";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Authentication')
@Controller("auth")
export class AuthController {
   constructor(private readonly authService: AuthService) {}
   
   @Public()
   @Post("register")
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Đăng ký tài khoản khách hàng mới' })
   @ApiResponse({ 
     status: 201, 
     description: 'Đăng ký thành công', 
     type: AuthResponse 
   })
   @ApiResponse({ status: 400, description: 'Email đã tồn tại hoặc lỗi Validation' })
   register(@Body() registerUserRequest: RegisterUserRequest) {
      return this.authService.register(registerUserRequest);
   }
   
   @Public()
   @Post("login")
   @HttpCode(HttpStatus.OK)
   @MessageResponse("Đăng nhập thành công")
   @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
   @ApiResponse({ 
     status: 200, 
     description: 'Đăng nhập thành công', 
     type: AuthResponse 
   })
   @ApiResponse({ status: 401, description: 'Sai mật khẩu / Tài khoản bị khóa' })
   @ApiResponse({ status: 404, description: 'Tài khoản không tồn tại' })
   login(@Body() loginRequest: LoginRequest) {
      return this.authService.login(loginRequest);
   }
}