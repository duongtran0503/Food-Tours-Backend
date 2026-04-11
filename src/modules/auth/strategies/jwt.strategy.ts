import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService:ConfigService) {
    super({

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      secretOrKey:configService.get<string>("JWT_SECRET"), 
    });
  }

  
  async validate(payload: any) {
    
    
    if (!payload) {
      throw new UnauthorizedException('Token không hợp lệ!');
    }

    
    return { 
      userId: payload.sub || payload.id || payload._id, 
      email: payload.email, 
      role: payload.role 
    };
  }
}