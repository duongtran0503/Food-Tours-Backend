import { AuthController } from "@/modules/auth/controllers/auth.controller";
import { AuthService } from "@/modules/auth/services/auth.service";
import { UsersModule } from "@/modules/users/user.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    
    
    JwtModule.registerAsync({
      global: true, 
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => {
        const secretKey = configService.get<string>('JWT_SECRET');
        
        return {
          secret: secretKey,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}