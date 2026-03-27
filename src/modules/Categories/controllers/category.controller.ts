import { Public } from "@/common/decorator/is.public";
import { Roles } from "@/common/decorator/roles.decorator";
import { CreateCategoryRequest } from "@/modules/Categories/dto/request/create-category.request";
import { GetCategoriesQueryRequest } from "@/modules/Categories/dto/request/get-categories-query.request";
import { UpdateCategoryRequest } from "@/modules/Categories/dto/request/update-category.request";
import { CategoryResponse } from "@/modules/Categories/dto/response/category-response";
import { CategoriesService } from "@/modules/Categories/services/category.service";
import { UserRoles } from "@/schemas/user.schema";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Categories') // Gom nhóm module Categories trên UI
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserRoles.ADMIN) 
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
  getCategories(@Query() query: GetCategoriesQueryRequest) {
    return this.categoriesService.findAllCategories(query);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN) 
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
  @Roles(UserRoles.ADMIN) 
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