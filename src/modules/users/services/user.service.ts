import { AppException } from '@/common/exceptions/app.exception';
import { UserRepository } from './../repositories/user.repository';
import { Injectable } from "@nestjs/common";
import { UserErrorCode } from '@/modules/users/config/user.error.code';
import { UserProfileResponse } from '@/modules/users/dto/response/user-profile-response';

@Injectable()
export class UserService {
  constructor(private readonly userRepository:UserRepository) {

  }

  async getProfile(userId:string) {
    const user = await this.userRepository.findOne({_id:userId})  
    if(!user) throw new AppException(UserErrorCode.USER_NOT_FOUND);
    
    return new UserProfileResponse(user)
  }

 
}