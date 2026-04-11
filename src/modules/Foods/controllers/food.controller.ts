import { Controller, Post, Body, Get, Query, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorator/is.public';
import { Roles } from '@/common/decorator/roles.decorator';
import { RolesGuard } from "@/modules/auth/guards/roles.guard"; 
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { UserRoles } from '@/schemas/user.schema';
import { FoodService } from '@/modules/Foods/services/food.service';
import { CreateFoodRequest } from '@/modules/Foods/dto/request/create-food.request';
import { UpdateFoodRequest } from '@/modules/Foods/dto/request/update-food.request';
import { GetFoodsQueryRequest } from '@/modules/Foods/dto/request/get-foods-query.request';
import { ActionCategoryFoodRequest } from '@/modules/Foods/dto/request/action-category-food.request';
import { FoodResponse } from '@/modules/Foods/dto/response/food-response.dto';

@ApiTags('Foods')
@Controller('foods')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @Roles(UserRoles.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo món ăn mới (Merchant)' })
  @ApiResponse({ status: 201, type: FoodResponse })
  createFood(@Body() data: CreateFoodRequest): Promise<FoodResponse> {
    return this.foodService.createFood(data);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách món ăn phân trang (Công khai)' })
  getPublicFoods(@Query() query: GetFoodsQueryRequest) {
    return this.foodService.findAllPublicFoods(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một món ăn' })
  @ApiResponse({ status: 200, type: FoodResponse })
  getFoodDetail(@Param('id') id: string): Promise<FoodResponse> {
    return this.foodService.findFoodById(id);
  }

  @Patch(':id')
  @Roles(UserRoles.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa món ăn (Merchant)' })
  @ApiResponse({ status: 200, type: FoodResponse })
  async updateFood(
    @Param('id') id: string,
    @Body() data: UpdateFoodRequest,
  ): Promise<FoodResponse> {
    return this.foodService.updateFood(id, data);
  }

  @Delete(':id')
  @Roles(UserRoles.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa món ăn (Merchant)' })
  async deleteFood(@Param('id') id: string) {
    await this.foodService.deleteFood(id);
    return {
      code: 'SUCCESS',
      message: 'Xóa món ăn thành công',
    };
  }

  @Patch(':id/categories')
  @Roles(UserRoles.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật danh mục cho món ăn (Merchant)' })
  addCategory(
    @Param('id') foodId: string,
    @Body() data: ActionCategoryFoodRequest
  ): Promise<FoodResponse> {
    return this.foodService.addCategoryToFood(foodId, data.categoryId);
  }

  @Delete(':id/categories')
  @Roles(UserRoles.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gỡ bỏ danh mục khỏi món ăn (Merchant)' })
  removeCategory(
    @Param('id') foodId: string,
  ): Promise<FoodResponse> {
    return this.foodService.removeCategoryFromFood(foodId);
  }
}