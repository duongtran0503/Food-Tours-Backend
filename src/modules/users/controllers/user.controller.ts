import { CurrentUser, ICurrentUser } from "@/common/decorator/current-user.decorator";
import { UserService } from "@/modules/users/services/user.service";
import { UserProfileResponse } from "@/modules/users/dto/response/user-profile-response";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserRequest } from "../dto/request/create-user.request";
import { UpdateUserRequest } from "../dto/request/update-user.request";
import { GetUsersQueryRequest } from "../dto/request/get-users-query.request";

@ApiTags('Users') // Đổi tên Tag lại một chút để bao quát cả Profile lẫn Quản lý User
@ApiBearerAuth()
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}
    @Get("/profile")
    @ApiOperation({ summary: 'Xem thông tin trang cá nhân của tôi (Dùng JWT Token)' })
    @ApiResponse({ 
      status: 200, 
      description: 'Lấy thông tin profile thành công', 
      type: UserProfileResponse 
    })
    @ApiResponse({ status: 401, description: 'Token không hợp lệ hoặc hết hạn' })
    getProfile(@CurrentUser() user: ICurrentUser): Promise<UserProfileResponse> {
        return this.userService.getProfile(user.userId);
    }

    // ========================================================
    // 2. CÁC API CRUD CHO QUẢN TRỊ VIÊN (ADMIN / STAFF)
    // ========================================================
    
    @Post()
    // @Roles(UserRoles.ADMIN) // Bỏ comment nếu bạn muốn check quyền chỉ Admin mới được tạo
    @ApiOperation({ summary: 'Tạo tài khoản User mới' })
    @ApiResponse({ status: 201, description: 'Tạo thành công', type: UserProfileResponse })
    create(@Body() data: CreateUserRequest) {
        return this.userService.createUser(data);
    }

    @Get()
    // @Roles(UserRoles.ADMIN, UserRoles.STAFF)
    @ApiOperation({ summary: 'Lấy danh sách người dùng có phân trang & tìm kiếm' })
    @ApiResponse({ status: 200, description: 'Thành công' })
    findAll(@Query() query: GetUsersQueryRequest) {
        return this.userService.findAllUsers(query);
    }

    @Get('/:id')
    // @Roles(UserRoles.ADMIN, UserRoles.STAFF)
    @ApiOperation({ summary: 'Xem chi tiết 1 người dùng theo ID' })
    @ApiResponse({ status: 200, type: UserProfileResponse })
    findOne(@Param('id') id: string) {
        // Tận dụng luôn hàm getProfile trong service vì logic giống hệt nhau (tìm user theo ID)
        return this.userService.getProfile(id); 
    }

    @Patch('/:id')
    // @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
    @ApiResponse({ status: 200, type: UserProfileResponse })
    update(
        @Param('id') id: string, 
        @Body() data: UpdateUserRequest
    ) {
        return this.userService.updateUser(id, data);
    }

    @Delete('/:id')
    // @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Xóa người dùng' })
    @ApiResponse({ status: 200, description: 'Xóa thành công' })
    remove(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}