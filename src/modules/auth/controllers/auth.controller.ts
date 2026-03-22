import { MessageResponse } from "@/common/decorator/message.response";
import { LoginRequest } from "@/modules/auth/dto/request/login-request";
import { RegisterUserRequest } from "@/modules/auth/dto/request/register-user-request";
import { AuthService } from "@/modules/auth/services/auth.service";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController {
   constructor(private readonly authService:AuthService) {}
   
   @Post("register")
   @HttpCode(HttpStatus.CREATED)
    register(@Body() registerUserRequest:RegisterUserRequest) {
      return   this.authService.register(registerUserRequest);
   }

   @Post("login")
   @MessageResponse("Đăng nhập thành công")
   login(@Body() loginRequest:LoginRequest) {
        return this.authService.login(loginRequest)
   }
}