import { Public } from "@/common/decorator/is.public";
import { Roles } from "@/common/decorator/roles.decorator";
import { CreateCategoryRequest } from "@/modules/Categories/dto/request/create-category.request";
import { GetCategoriesQueryRequest } from "@/modules/Categories/dto/request/get-categories-query.request";
import { UpdateCategoryRequest } from "@/modules/Categories/dto/request/update-category.request";
import { CategoryResponse } from "@/modules/Categories/dto/response/category-response";
import { CategoriesService } from "@/modules/Categories/services/category.service";
import { UserRoles } from "@/schemas/user.schema";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Headers } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Categories') // Gom nhóm module Categories trên UI
@Controller("categories")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth() // Đánh dấu API cần token Admin
  @ApiOperation({ summary: 'Tạo danh mục món ăn mới (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: CategoryResponse })
  @ApiResponse({ status: 400, description: 'Lỗi trùng lặp Slug / Dữ liệu không hợp lệ' })
  create(@Body() data: CreateCategoryRequest) {
    return this.categoriesService.createCategory(data);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách danh mục phân trang, tìm kiếm công khai' })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/CategoryResponse' } },
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
  @ApiHeader({
    name: 'lang',
    description: 'Ngôn ngữ (vi, en, jp, zh, ru)',
    required: false,
    schema: { default: 'vi', enum: ['vi', 'en', 'jp', 'zh', 'ru'] }
  })
  getCategories(
    @Query() query: GetCategoriesQueryRequest,
    @Headers('lang') lang: string = 'vi'
  ) {
    return this.categoriesService.findAllCategories(query, lang);
  }

  // Các hàm create, update cũng thêm @Headers('lang') tương tự để trả về Response đúng tiếng

  @Patch(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa danh mục món ăn (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: CategoryResponse })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại' })
  updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    return this.categoriesService.updateCategory(id, data);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa danh mục (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Xóa thành công',
    schema: { properties: { deleteItemId: { type: 'string', example: '65fc34e45d4f3b0012abcd12' } } }
  })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại' })
  async deleteCategory(@Param('id') id: string) {
    await this.categoriesService.deleteCategory(id);
    return { deleteItemId: id };
  }
}