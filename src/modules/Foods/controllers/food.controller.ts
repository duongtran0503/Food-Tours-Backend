import { Public } from '@/common/decorator/is.public';
import { Roles } from '@/common/decorator/roles.decorator';
import { ActionCategoryFoodRequest } from '@/modules/Foods/dto/request/action-category-food.request';
import { CreateFoodRequest } from '@/modules/Foods/dto/request/create-food.request';
import { GetFoodsQueryRequest } from '@/modules/Foods/dto/request/get-foods-query.request';
import { UpdateFoodRequest } from '@/modules/Foods/dto/request/update-food.request';
import { FoodResponse } from '@/modules/Foods/dto/response/food-response.dto';
import { FoodService } from '@/modules/Foods/services/food.service';
import { UserRoles } from '@/schemas/user.schema';
import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Foods') 
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @Roles(UserRoles.ADMIN) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo món ăn mới (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: FoodResponse })
  createFood(@Body() data: CreateFoodRequest): Promise<FoodResponse> {
    return this.foodService.createFood(data);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách món ăn phân trang (Công khai)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thành công',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/FoodResponse' } },
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
  getPublicFoods(@Query() query: GetFoodsQueryRequest) {
    return this.foodService.findAllPublicFoods(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một món ăn' })
  @ApiResponse({ status: 200, description: 'Thành công', type: FoodResponse })
  @ApiResponse({ status: 404, description: 'Không tìm thấy món ăn' })
  getFoodDetail(@Param('id') id: string): Promise<FoodResponse> {
    return this.foodService.findFoodById(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa món ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: FoodResponse })
  async updateFood(
    @Param('id') id: string,
    @Body() data: UpdateFoodRequest,
  ): Promise<FoodResponse> {
    return this.foodService.updateFood(id, data);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa món ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Xóa món ăn thành công' })
  async deleteFood(@Param('id') id: string) {
    await this.foodService.deleteFood(id);
    return {
      code: 'SUCCESS',
      message: 'Xóa món ăn thành công',
    };
  }

  @Patch(':id/categories')
  @Roles(UserRoles.ADMIN) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật danh mục cho món ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: FoodResponse })
  addCategory(
    @Param('id') foodId: string,
    @Body() data: ActionCategoryFoodRequest
  ): Promise<FoodResponse> {
    return this.foodService.addCategoryToFood(foodId, data.categoryId);
  }

  @Delete(':id/categories')
  @Roles(UserRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gỡ bỏ danh mục khỏi món ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Gỡ bỏ thành công', type: FoodResponse })
  removeCategory(
    @Param('id') foodId: string,
  ): Promise<FoodResponse> {
    return this.foodService.removeCategoryFromFood(foodId);
  }
}