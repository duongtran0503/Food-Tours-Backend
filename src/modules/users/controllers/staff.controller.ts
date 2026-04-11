import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpCode, 
  HttpStatus, 
  Param, 
  Patch, 
  Post, 
  Query, 
  UseGuards 
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// Decorators
import { CurrentUser } from "@/common/decorator/current-user.decorator";
import { Roles } from "@/common/decorator/roles.decorator";

// Guards (Đã sửa lại đường dẫn theo đúng vị trí Lợi báo)
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/modules/auth/guards/roles.guard"; 

// DTOs & Services
import { CreateStaffRequest } from "@/modules/users/dto/request/create-staff.request";
import { GetStaffsQueryRequest } from "@/modules/users/dto/request/get-staffs-query-request";
import { UpdateStaffRequest } from "@/modules/users/dto/request/update.staff.request";
import { UserProfileResponse } from "@/modules/users/dto/response/user-profile-response";
import { StaffService } from "@/modules/users/services/staff.service";
import { UserRoles } from "@/schemas/user.schema";

@ApiTags('Staffs (Admin Management)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("staffs")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Xem danh sách tài khoản nhân viên (Admin)' })
  async getStaffs(@Query() query: GetStaffsQueryRequest) {
    return this.staffService.findAllStaffs(query);
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Xem chi tiết tài khoản nhân viên (Admin)' })
  async getStaffDetail(@Param('id') id: string): Promise<UserProfileResponse> {
    return this.staffService.findStaffById(id);
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Khởi tạo tài khoản nhân viên mới (Admin)' })
  async createStaff(@Body() userData: CreateStaffRequest): Promise<UserProfileResponse> {
    return this.staffService.createStaff(userData);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản nhân viên (Admin)' })
  async updateStaff(
    @Param('id') id: string,
    @Body() userData: UpdateStaffRequest,
  ): Promise<UserProfileResponse> {
    return this.staffService.updateStaff(id, userData);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa vĩnh viễn tài khoản (Admin - Không tự xóa chính mình)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  async deleteStaff(
    @Param('id') id: string,
    @CurrentUser('userId') currentAdminId: string, 
  ) {
    // Gọi service thực hiện xóa
    await this.staffService.deleteStaff(id, currentAdminId);
    
    return {
      code: 'SUCCESS',
      message: 'Xóa tài khoản nhân viên thành công',
    };
  }
}