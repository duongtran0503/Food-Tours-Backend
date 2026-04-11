import { Controller, Get, UseGuards, Logger 
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags 
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { CurrentUser, ICurrentUser } from "@/common/decorator/current-user.decorator";
import { UserService } from "@/modules/users/services/user.service";
import { UserProfileResponse } from "@/modules/users/dto/response/user-profile-response";

@ApiTags('Users (Profile Management)') 
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}

    @Get("/profile")
    @ApiOperation({ summary: 'Xem thông tin trang cá nhân của tôi (Dùng JWT Token)' })
    @ApiResponse({ 
      status: 200, 
      description: 'Lấy thông tin profile thành công', 
      type: UserProfileResponse 
    })
    @ApiResponse({ status: 401, description: 'Bạn cần đăng nhập để thực hiện hành động này' })
    async getProfile(@CurrentUser() user: ICurrentUser): Promise<UserProfileResponse> {

        this.logger.log(`Fetching profile for User ID: ${user.userId}`);

        return this.userService.getProfile(user.userId);
    }
}