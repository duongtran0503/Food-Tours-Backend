import { CurrentUser } from "@/common/decorator/current-user.decorator";
import { Roles } from "@/common/decorator/roles.decorator";
import { CreateStaffRequest } from "@/modules/users/dto/request/create-staff.request";
import { GetStaffsQueryRequest } from "@/modules/users/dto/request/get-staffs-query-request";
import { UpdateStaffRequest } from "@/modules/users/dto/request/update.staff.request";
import { UserProfileResponse } from "@/modules/users/dto/response/user-profile-response";
import { StaffService } from "@/modules/users/services/staff.service";
import { UserRoles } from "@/schemas/user.schema";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Staffs (Admin Management)')
@ApiBearerAuth() 
@Controller("staffs")
export class StaffController {
   constructor(private readonly staffService: StaffService) {}
  
  @Get()
  @Roles(UserRoles.ADMIN) 
  @ApiOperation({ summary: 'Xem danh sách tài khoản nhân viên phân trang (Admin)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thành công',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/UserProfileResponse' } },
        meta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            itemCount: { type: 'number' },
            itemsPerPage: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
          }
        }
      }
    }
  })
  async getStaffs(@Query() query: GetStaffsQueryRequest) {
    return this.staffService.findAllStaffs(query);
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN) 
  @ApiOperation({ summary: 'Xem chi tiết tài khoản nhân viên (Admin)' })
  @ApiResponse({ status: 200, description: 'Thành công', type: UserProfileResponse })
  @ApiResponse({ status: 404, description: 'Tài khoản không tồn tại' })
  async getStaffDetail(
    @Param('id') id: string,
  ): Promise<UserProfileResponse> {
    return this.staffService.findStaffById(id);
  }

  @Post()
  @Roles(UserRoles.ADMIN) 
  @ApiOperation({ summary: 'Khởi tạo tài khoản nhân viên mới (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công', type: UserProfileResponse })
  @ApiResponse({ status: 400, description: 'Email đã tồn tại / Dữ liệu không hợp lệ' })
  async createStaff(@Body() userData: CreateStaffRequest, @CurrentUser('role') role: string): Promise<UserProfileResponse> {
    return this.staffService.createStaff(userData, role);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN) 
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản nhân viên (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: UserProfileResponse })
  @ApiResponse({ status: 404, description: 'Nhân viên không tồn tại' })
  async updateStaff(
    @Param('id') id: string,
    @Body() userData: UpdateStaffRequest,
    @CurrentUser('role') role: string
  ): Promise<UserProfileResponse> {
    return this.staffService.updateStaff(id, userData, role);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa vĩnh viễn tài khoản nhân viên (Admin - Không tự xóa chính mình)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 400, description: 'Không thể tự xóa bản thân' })
  async deleteStaff(
    @Param('id') id: string,
    @CurrentUser('userId') currentAdminId: string, 
    @CurrentUser('role') role: string
  ) {
    await this.staffService.deleteStaff(id, currentAdminId, role);
    
    return {
      code: 'SUCCESS',
      message: 'Xóa tài khoản nhân viên thành công',
    };
  }
}