import { AppException } from '@/common/exceptions/app.exception';
import { UserRepository } from './../repositories/user.repository';
import { Injectable } from "@nestjs/common";
import { UserErrorCode } from '@/modules/users/config/user.error.code';
import { UserProfileResponse } from '@/modules/users/dto/response/user-profile-response';
import { CreateUserRequest } from '../dto/request/create-user.request';
import { UpdateUserRequest } from '../dto/request/update-user.request';
import { GetUsersQueryRequest } from '../dto/request/get-users-query.request';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) throw new AppException(UserErrorCode.USER_NOT_FOUND);
    
    return new UserProfileResponse(user);
  }

  async createUser(data: CreateUserRequest) {
    const existingUser = await this.userRepository.findOne({ email: data.email });
    if (existingUser) {
      throw new AppException(UserErrorCode.EMAIL_ALREADY_EXISTS); 
    }
    const { password, ...restData } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.create({
      ...restData,
      password_hash: hashedPassword,
    });

    return new UserProfileResponse(newUser);
  }

  async findAllUsers(query: GetUsersQueryRequest) {
    const { keyword, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (keyword) {
      filter.$or = [
        { fullName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phoneNumber: { $regex: keyword, $options: 'i' } }
      ];
    }

    const [users, totalItems] = await Promise.all([
      this.userRepository.find(filter, { skip, limit }),
      this.userRepository.count(filter)
    ]);

    return {
      items: users.map((user) => new UserProfileResponse(user)),
      meta: {
        totalItems,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async updateUser(userId: string, data: UpdateUserRequest) {
    await this.getProfile(userId); 

    const updateData = { ...data };
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.findByIdAndUpdate(userId, updateData, { new: true });
    
    return new UserProfileResponse(updatedUser);
  }

  async deleteUser(userId: string) {
    await this.getProfile(userId);

    await this.userRepository.findByIdAndDelete(userId);
    
    return { deleteItemId: userId };
  }
}