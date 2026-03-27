import { AuthController } from "@/modules/auth/controllers/auth.controller";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { AuthService } from "@/modules/auth/services/auth.service";
import { JwtStrategy } from "@/modules/auth/strategies/jwt.strategy";
import { UsersModule } from "@/modules/users/user.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    
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
  providers: [AuthService,JwtStrategy,{
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
  exports: [AuthService], 
})
export class AuthModule {}