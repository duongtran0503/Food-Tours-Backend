import { Public } from '@/common/decorator/is.public';
import { Roles } from '@/common/decorator/roles.decorator';
import { ActionCategoryFoodRequest } from '@/modules/Foods/dto/request/action-category-food.request';
import { CreateFoodRequest } from '@/modules/Foods/dto/request/create-food.request';
import { GetFoodsQueryRequest } from '@/modules/Foods/dto/request/get-foods-query.request';
import { UpdateFoodRequest } from '@/modules/Foods/dto/request/update-food.request';
import { FoodResponse } from '@/modules/Foods/dto/response/food-response.dto';
import { FoodService } from '@/modules/Foods/services/food.service';
import { UserRoles } from '@/schemas/user.schema';
import { Controller, Post, Body, Get, Query, Param, Patch, Delete, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common'; // Thêm dòng này
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'; // Thêm dòng này
import { RolesGuard } from '@/common/guards/roles.guard'; // Thêm dòng này

@ApiTags('Foods')
@Controller('foods')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FoodController {
  constructor(private readonly foodService: FoodService) { }

  @Post()
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo món ăn mới (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: FoodResponse })
  createFood(@Body() data: CreateFoodRequest): Promise<FoodResponse> {
    // Khi tạo mới, mặc định trả về tiếng Việt (vi)
    return this.foodService.createFood(data);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách món ăn phân trang (Công khai)' })
  @ApiHeader({ name: 'lang', description: 'Ngôn ngữ hiển thị (vi, en, jp, zh, ru)', required: false })
  @ApiResponse({ status: 200, description: 'Thành công' })
  getPublicFoods(
    @Query() query: GetFoodsQueryRequest,
    @Headers('lang') lang: string = 'vi' // 👈 Lấy ngôn ngữ từ Header
  ) {
    return this.foodService.findAllPublicFoods(query, lang);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một món ăn' })
  @ApiHeader({ name: 'lang', description: 'Ngôn ngữ hiển thị', required: false })
  @ApiResponse({ status: 200, description: 'Thành công', type: FoodResponse })
  getFoodDetail(
    @Param('id') id: string,
    @Headers('lang') lang: string = 'vi'
  ): Promise<FoodResponse> {
    return this.foodService.findFoodById(id, lang);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa món ăn (Admin/Merchant)' })
  @ApiHeader({ name: 'lang', description: 'Ngôn ngữ hiển thị sau khi cập nhật', required: false })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: FoodResponse })
  async updateFood(
    @Param('id') id: string,
    @Body() data: UpdateFoodRequest,
    @Headers('lang') lang: string = 'vi'
  ): Promise<FoodResponse> {
    return this.foodService.updateFood(id, data, lang);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa món ăn (Admin/Merchant)' })
  @ApiResponse({ status: 200, description: 'Xóa món ăn thành công' })
  async deleteFood(@Param('id') id: string) {
    await this.foodService.deleteFood(id);
    return {
      code: 'SUCCESS',
      message: 'Xóa món ăn thành công',
    };
  }

  @Patch(':id/categories')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật danh mục cho món ăn (Admin)' })
  addCategory(
    @Param('id') foodId: string,
    @Body() data: ActionCategoryFoodRequest,
    @Headers('lang') lang: string = 'vi'
  ): Promise<FoodResponse> {
    return this.foodService.addCategoryToFood(foodId, data.categoryId, lang);
  }

  @Delete(':id/categories')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gỡ bỏ danh mục khỏi món ăn (Admin)' })
  removeCategory(
    @Param('id') foodId: string,
    @Headers('lang') lang: string = 'vi'
  ): Promise<FoodResponse> {
    return this.foodService.removeCategoryFromFood(foodId, lang);
  }
}