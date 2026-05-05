import { Public } from '@/common/decorator/is.public';
import { Roles } from '@/common/decorator/roles.decorator';
import { ActionCategoryFoodRequest } from '@/modules/Foods/dto/request/action-category-food.request';
import { CreateFoodRequest } from '@/modules/Foods/dto/request/create-food.request';
import { GetFoodsQueryRequest } from '@/modules/Foods/dto/request/get-foods-query.request';
import { UpdateFoodRequest } from '@/modules/Foods/dto/request/update-food.request';
import { FoodResponse } from '@/modules/Foods/dto/response/food-response.dto';
import { FoodService } from '@/modules/Foods/services/food.service';
import { UserRoles } from '@/schemas/user.schema';
import { Controller, Post, Body, Get, Query, Param, Patch, Delete, Headers, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'; 
import { RolesGuard } from '@/common/guards/roles.guard'; 

@ApiTags('Foods')
@Controller('foods')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FoodController {
  constructor(private readonly foodService: FoodService) { }

  @Post()
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo món ăn mới (Admin/Merchant)' })
  createFood(@Body() data: CreateFoodRequest, @Req() req: any): Promise<FoodResponse> {
    return this.foodService.createFood(data, req.user.userId);
  }

  // 👇 API MỚI: Dành cho Merchant lấy danh sách món của mình
  @Get('me')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem món ăn của tôi (Merchant)' })
  getMyFoods(@Query() query: GetFoodsQueryRequest, @Req() req: any, @Headers('lang') lang: string = 'vi') {
    return this.foodService.findAllMerchantFoods(req.user.userId, query, lang);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách món ăn phân trang (Công khai)' })
  getPublicFoods(@Query() query: GetFoodsQueryRequest, @Headers('lang') lang: string = 'vi') {
    return this.foodService.findAllPublicFoods(query, lang);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một món ăn' })
  getFoodDetail(@Param('id') id: string, @Headers('lang') lang: string = 'vi'): Promise<FoodResponse> {
    return this.foodService.findFoodById(id, lang);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa món ăn (Admin/Merchant)' })
  async updateFood(@Param('id') id: string, @Body() data: UpdateFoodRequest, @Req() req: any, @Headers('lang') lang: string = 'vi'): Promise<FoodResponse> {
    return this.foodService.updateFood(id, data, lang, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa món ăn (Admin/Merchant)' })
  async deleteFood(@Param('id') id: string, @Req() req: any) {
    await this.foodService.deleteFood(id, req.user.userId, req.user.role);
    return { code: 'SUCCESS', message: 'Xóa món ăn thành công' };
  }

  @Patch(':id/categories')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật danh mục cho món ăn (Admin/Merchant)' })
  addCategory(@Param('id') foodId: string, @Body() data: ActionCategoryFoodRequest, @Req() req: any, @Headers('lang') lang: string = 'vi'): Promise<FoodResponse> {
    return this.foodService.addCategoryToFood(foodId, data.categoryId, lang, req.user.userId, req.user.role);
  }

  @Delete(':id/categories')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gỡ bỏ danh mục khỏi món ăn (Admin/Merchant)' })
  removeCategory(@Param('id') foodId: string, @Req() req: any, @Headers('lang') lang: string = 'vi'): Promise<FoodResponse> {
    return this.foodService.removeCategoryFromFood(foodId, lang, req.user.userId, req.user.role);
  }
}