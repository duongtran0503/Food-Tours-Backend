import { Controller, Post, Body, Get, Query, Param, Patch, Delete, Headers, Req, UseGuards } from '@nestjs/common';
import { UserRoles } from '@/schemas/user.schema';
import { Roles } from '@/common/decorator/roles.decorator';
import { RestaurantService } from '@/modules/Restaurants/services/restaurant.service';
import { CreateRestaurantRequest } from '@/modules/Restaurants/dto/request/create-restaurant.request';
import { RestaurantResponse } from '@/modules/Restaurants/dto/response/restaurant-response';
import { GetRestaurantsQueryRequest } from '@/modules/Restaurants/dto/request/get-restaurants-query.request';
import { Public } from '@/common/decorator/is.public';
import { RestaurantDetailResponse } from '@/modules/Restaurants/dto/response/restaurant-detail-response';
import { UpdateRestaurantRequest } from '@/modules/Restaurants/dto/request/update-restaurant.request';
import { AddFoodsToRestaurantRequest } from '@/modules/Restaurants/dto/request/add-foods-restaurant.request';
import { RemoveFoodsFromRestaurantRequest } from '@/modules/Restaurants/dto/request/remove-foods-restaurant.request';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';;

// Đã thêm import cho Guards ở đây
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Restaurants')
@Controller('/restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiHeader({ name: 'lang', description: 'Ngôn ngữ hiển thị (vi, en, jp, zh, ru)', required: false })
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Post()
  @Roles(UserRoles.ADMIN, 'merchant') // Đã fix lỗi chữ MERCHANT bằng chuỗi string
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo quán ăn mới (Merchant/Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: RestaurantResponse })
  createRestaurant(
    @Body() data: CreateRestaurantRequest,
    @Req() req: any
  ): Promise<RestaurantResponse> {
    const userId = req.user.userId;
    return this.restaurantService.createRestaurant(data, userId);
  }
  @Get('merchant/profile')
  @Roles('merchant') // Đã sửa lại chuẩn quyền 'merchant'
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ tổng hợp của Merchant (Cá nhân + Cửa hàng)' })
  async getMerchantProfile(
    @Req() req: any,
    @Headers('lang') lang: string = 'vi'
  ): Promise<any> {
    const userId = req.user.userId; 
    return this.restaurantService.getMerchantProfile(userId, lang);
  }
  @Patch(':id/approve')
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duyệt / Từ chối quán ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Thành công', type: RestaurantResponse })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['approved', 'rejected'], example: 'approved' }
      }
    }
  })

  approveRestaurant(
    @Param('id') id: string,
    @Body('status') status: 'approved' | 'rejected',
    @Headers('lang') lang: string = 'vi'
  ): Promise<RestaurantResponse> {
    return this.restaurantService.approveRestaurant(id, status, lang);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách quán ăn phân trang (Công khai)' })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/RestaurantResponse' } },
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
  getPublicRestaurants(
    @Query() query: GetRestaurantsQueryRequest,
    @Headers('lang') lang: string = 'vi'
  ) {
    return this.restaurantService.findAllPublicRestaurants(query, lang);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một quán ăn (Populate các món ăn)' })
  @ApiResponse({ status: 200, description: 'Thành công', type: RestaurantDetailResponse })
  @ApiResponse({ status: 404, description: 'Quán ăn không tồn tại' })
  async getRestaurantDetail(
    @Param('id') id: string,
    @Headers('lang') lang: string = 'vi'
  ): Promise<RestaurantDetailResponse> {
    return this.restaurantService.findRestaurantById(id, lang);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin quán ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: RestaurantResponse })
  async updateRestaurant(
    @Param('id') id: string,
    @Body() data: UpdateRestaurantRequest,
    @Headers('lang') lang: string = 'vi'
  ): Promise<RestaurantResponse> {
    return this.restaurantService.updateRestaurant(id, data, lang);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa quán ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Xóa quán ăn thành công' })
  async deleteRestaurant(@Param('id') id: string) {
    await this.restaurantService.deleteRestaurant(id);
    return {
      code: 'SUCCESS',
      message: 'Xóa quán ăn thành công',
    };
  }

  @Post(':restaurantId/foods')
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm hàng loạt món ăn liên kết vào quán ăn (Admin)' })
  @ApiResponse({ status: 201, description: 'Thêm thành công', type: RestaurantResponse })
  async addFoodsToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() data: AddFoodsToRestaurantRequest,
    @Headers('lang') lang: string = 'vi'
  ): Promise<RestaurantResponse> {
    return this.restaurantService.addFoodsToRestaurant(restaurantId, data, lang);
  }

  @Delete(':restaurantId/foods')
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gỡ bỏ hàng loạt món ăn liên kết ra khỏi quán ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Gỡ bỏ thành công', type: RestaurantResponse })
  async removeFoodsFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() data: RemoveFoodsFromRestaurantRequest,
    @Headers('lang') lang: string = 'vi'
  ): Promise<RestaurantResponse> {
    return this.restaurantService.removeFoodsFromRestaurant(restaurantId, data, lang);
  }
}