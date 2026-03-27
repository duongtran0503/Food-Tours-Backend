import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Restaurants')
@Controller('/restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo quán ăn mới (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: RestaurantResponse })
  createRestaurant(@Body() data: CreateRestaurantRequest): Promise<RestaurantResponse> {
    return this.restaurantService.createRestaurant(data);
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
  getPublicRestaurants(@Query() query: GetRestaurantsQueryRequest) {
    return this.restaurantService.findAllPublicRestaurants(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một quán ăn (Populate các món ăn)' })
  @ApiResponse({ status: 200, description: 'Thành công', type: RestaurantDetailResponse })
  @ApiResponse({ status: 404, description: 'Quán ăn không tồn tại' })
  async getRestaurantDetail(@Param('id') id: string): Promise<RestaurantDetailResponse> {
    return this.restaurantService.findRestaurantById(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin quán ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: RestaurantResponse })
  async updateRestaurant(
    @Param('id') id: string,
    @Body() data: UpdateRestaurantRequest,
  ): Promise<RestaurantResponse> {
    return this.restaurantService.updateRestaurant(id, data);
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
  ): Promise<RestaurantResponse> {
    return this.restaurantService.addFoodsToRestaurant(restaurantId, data);
  }

  @Delete(':restaurantId/foods')
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gỡ bỏ hàng loạt món ăn liên kết ra khỏi quán ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Gỡ bỏ thành công', type: RestaurantResponse })
  async removeFoodsFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() data: RemoveFoodsFromRestaurantRequest,
  ): Promise<RestaurantResponse> {
    return this.restaurantService.removeFoodsFromRestaurant(restaurantId, data);
  }
}