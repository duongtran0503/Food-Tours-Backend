import { CurrentUser, ICurrentUser } from "@/common/decorator/current-user.decorator";
import { UserService } from "@/modules/users/services/user.service";
import { UserProfileResponse } from "@/modules/users/dto/response/user-profile-response";
import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Users (Profile Management)') 
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
}