import { 
  Injectable, 
  InternalServerErrorException, 
  BadRequestException 
} from "@nestjs/common";
import { QueryFilter } from "mongoose";
import * as bcrypt from "bcrypt";

// Config & Exceptions
import { AppException } from "@/common/exceptions/app.exception";
import { AppConfig } from "@/config/app.config";
import { UserErrorCode } from "@/modules/users/config/user.error.code";

// DTOs
import { CreateStaffRequest } from "@/modules/users/dto/request/create-staff.request";
import { GetStaffsQueryRequest } from "@/modules/users/dto/request/get-staffs-query-request";
import { UpdateStaffRequest } from "@/modules/users/dto/request/update.staff.request";
import { UserProfileResponse } from "@/modules/users/dto/response/user-profile-response";

// Repositories & Schemas
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { UserDocument, UserRoles, UserStatus } from "@/schemas/user.schema";

@Injectable()
export class StaffService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Lấy danh sách nhân viên (Role ADMIN) có phân trang và tìm kiếm
   */
  async findAllStaffs(query: GetStaffsQueryRequest) {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const filter: QueryFilter<UserDocument> = {
      role: UserRoles.ADMIN,
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } }, // Tìm kiếm cả theo SĐT
      ];
    }

    const userModel = this.userRepository.getModel();

    const [staffs, totalItems] = await Promise.all([
      userModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean().exec(),
      userModel.countDocuments(filter).exec(),
    ]);

    const dataFormatted = staffs.map((staff) => new UserProfileResponse(staff));

    return {
      items: dataFormatted,
      meta: {
        totalItems,
        itemCount: dataFormatted.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findStaffById(id: string): Promise<UserProfileResponse> {
    const staff = await this.userRepository.findById(id);

    if (!staff) {
      throw new AppException(UserErrorCode.USER_NOT_FOUND);
    }

    if (staff.role !== UserRoles.ADMIN) {
      throw new AppException(UserErrorCode.USER_IS_NOT_ADMIN);
    }

    return new UserProfileResponse(staff);
  }

  async createStaff(userData: CreateStaffRequest): Promise<UserProfileResponse> {
    const { email, fullName, password, phoneNumber } = userData;
    const existingUser = await this.userRepository.findOne({ email });

    if (existingUser) {
      throw new AppException(UserErrorCode.USER_ALREADY_ACTIVE);
    }

    const saltRounds = AppConfig.SECURITY?.SALT_ROUNDS || 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newStaffData = {
      email,
      fullName,
      phoneNumber, 
      password_hash,
      role: UserRoles.ADMIN,
      status: UserStatus.ACTIVE,
    };

    try {
      const createdStaff = await this.userRepository.create(newStaffData as any);
      return new UserProfileResponse(createdStaff);
    } catch (error) {
      console.error("StaffService Error:", error);
      throw new InternalServerErrorException("Đã xảy ra lỗi hệ thống khi tạo nhân viên.");
    }
  }

  async updateStaff(id: string, userData: UpdateStaffRequest): Promise<UserProfileResponse> {
    const staff = await this.userRepository.findById(id);
    if (!staff) {
      throw new AppException(UserErrorCode.USER_NOT_FOUND);
    }

    if (staff.role !== UserRoles.ADMIN) {
      throw new AppException(UserErrorCode.USER_UPDATE_FAILED);
    }

    const updateData = { ...userData };
    
    const updatedStaff = await this.userRepository.update(id, updateData);

    if (!updatedStaff) {
      throw new AppException(UserErrorCode.USER_UPDATE_FAILED);
    }

    return new UserProfileResponse(updatedStaff);
  }

  async deleteStaff(id: string, currentAdminId: string): Promise<void> {
    if (id === currentAdminId) {
      throw new AppException(UserErrorCode.USER_DELETE_FAILED);
    }

    const staff = await this.userRepository.findById(id);
    if (!staff) {
      throw new AppException(UserErrorCode.USER_NOT_FOUND);
    }

    if (staff.role !== UserRoles.ADMIN) {
      throw new AppException(UserErrorCode.USER_DELETE_FAILED);
    }

    const deletedResult = await this.userRepository.delete(id);
    if (!deletedResult) {
      throw new AppException(UserErrorCode.USER_DELETE_FAILED);
    }
  }
}