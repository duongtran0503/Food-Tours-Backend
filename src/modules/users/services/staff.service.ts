import { AppException } from "@/common/exceptions/app.exception";
import { AppConfig } from "@/config/app.config";
import { UserErrorCode } from "@/modules/users/config/user.error.code";
import { CreateStaffRequest } from "@/modules/users/dto/request/create-staff.request";
import { GetStaffsQueryRequest } from "@/modules/users/dto/request/get-staffs-query-request";
import { UserProfileResponse } from "@/modules/users/dto/response/user-profile-response";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { UserDocument, UserRoles } from "@/schemas/user.schema";
import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { QueryFilter } from "mongoose";
import * as bcrypt from "bcrypt";
import { UpdateStaffRequest } from "@/modules/users/dto/request/update.staff.request";

@Injectable()
export class StaffService {
  constructor(private readonly userRepository: UserRepository) {}

  // Lấy danh sách (Cho phép cả ADMIN và STAFF xem)
  async findAllStaffs(query: GetStaffsQueryRequest) {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const filter: QueryFilter<UserDocument> = {
      role: { $in: [UserRoles.ADMIN, UserRoles.STAFF] as any[] }, 
    };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const userModel = this.userRepository.getModel();
    const [staffs, totalItems] = await Promise.all([
      userModel.find(filter).skip(skip).limit(limit).lean().exec(),
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

  // Xem chi tiết (Cho phép cả ADMIN và STAFF xem)
  async findStaffById(id: string): Promise<UserProfileResponse> {
    const staff = await this.userRepository.findById(id);
    if (!staff) throw new AppException(UserErrorCode.USER_NOT_FOUND);

    if (staff.role !== UserRoles.ADMIN && staff.role !== UserRoles.STAFF) {
      throw new AppException(UserErrorCode.USER_IS_NOT_ADMIN);
    }
    return new UserProfileResponse(staff);
  }

  // THÊM: Chỉ ADMIN mới được tạo
  async createStaff(userData: CreateStaffRequest, requesterRole: string): Promise<UserProfileResponse> {
    if (requesterRole !== UserRoles.ADMIN) {
      throw new ForbiddenException("Chỉ Quản trị viên (Admin) mới có quyền tạo tài khoản!");
    }

    const { email, fullName, password, phoneNumber, role } = userData;

    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) throw new AppException(UserErrorCode.USER_ALREADY_ACTIVE);
    
    const password_hash = await bcrypt.hash(password, AppConfig.SECURITY.SALT_ROUNDS);

    const newStaffData = {
      email, fullName, phoneNumber, password_hash,
      role: role || UserRoles.STAFF,
    };

    try {
      const createdStaff = await this.userRepository.create(newStaffData as any);
      return new UserProfileResponse(createdStaff);
    } catch (error) {
      throw new InternalServerErrorException('Đã xảy ra lỗi hệ thống khi tạo tài khoản.');
    }
  }

  // SỬA: Chỉ ADMIN mới được sửa
  async updateStaff(id: string, userData: UpdateStaffRequest, requesterRole: string): Promise<UserProfileResponse> {
    if (requesterRole !== UserRoles.ADMIN) {
      throw new ForbiddenException("Chỉ Quản trị viên (Admin) mới có quyền chỉnh sửa tài khoản!");
    }

    const staff = await this.userRepository.findById(id);
    if (!staff) throw new AppException(UserErrorCode.USER_NOT_FOUND);

    if (staff.role !== UserRoles.ADMIN && staff.role !== UserRoles.STAFF) {
      throw new AppException(UserErrorCode.USER_UPDATE_FAILED);
    }

    const updatedStaff = await this.userRepository.update(id, userData);
    if (!updatedStaff) throw new AppException(UserErrorCode.USER_UPDATE_FAILED);

    return new UserProfileResponse(updatedStaff);
  }

  // XÓA: Chỉ ADMIN mới được xóa
  async deleteStaff(id: string, currentAdminId: string, requesterRole: string): Promise<void> {
    if (requesterRole !== UserRoles.ADMIN) {
      throw new ForbiddenException("Chỉ Quản trị viên (Admin) mới có quyền xóa tài khoản!");
    }

    if (id === currentAdminId) {
      throw new AppException(UserErrorCode.USER_DELETE_FAILED); 
    }

    const staff = await this.userRepository.findById(id);
    if (!staff) throw new AppException(UserErrorCode.USER_NOT_FOUND);

    if (staff.role !== UserRoles.ADMIN && staff.role !== UserRoles.STAFF) {
      throw new AppException(UserErrorCode.USER_DELETE_FAILED);
    }

    const deletedResult = await this.userRepository.delete(id);
    if (!deletedResult) throw new AppException(UserErrorCode.USER_DELETE_FAILED);
  }
}