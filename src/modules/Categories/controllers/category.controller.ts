import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// Guards & Decorators
import { Public } from "@/common/decorator/is.public";
import { Roles } from "@/common/decorator/roles.decorator";
import { RolesGuard } from "@/modules/auth/guards/roles.guard"; 
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";

// Service & DTOs
import { UserRoles } from "@/schemas/user.schema";
import { CategoriesService } from "@/modules/Categories/services/category.service";
import { CreateCategoryRequest } from "@/modules/Categories/dto/request/create-category.request";
import { GetCategoriesQueryRequest } from "@/modules/Categories/dto/request/get-categories-query.request";
import { UpdateCategoryRequest } from "@/modules/Categories/dto/request/update-category.request";
import { CategoryResponse } from "@/modules/Categories/dto/response/category-response";

@ApiTags('Categories')
@Controller("categories")
@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Kích hoạt kiểm tra Token và Quyền hạn cho toàn bộ Controller
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserRoles.MERCHANT) // 🟢 CHỈ Merchant mới được tạo danh mục
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo danh mục món ăn mới (Merchant)' })
  @ApiResponse({ status: 201, type: CategoryResponse })
  create(@Body() data: CreateCategoryRequest) {
    return this.categoriesService.createCategory(data);
  }
  
  @Public() // 🔵 Công khai: Khách hàng vẫn xem được danh sách danh mục
  @Get()
  @ApiOperation({ summary: 'Xem danh sách danh mục (Công khai)' })
  getCategories(@Query() query: GetCategoriesQueryRequest) {
    return this.categoriesService.findAllCategories(query);
  }

  @Patch(':id')
  @Roles(UserRoles.MERCHANT) // 🟢 CHỈ Merchant mới được sửa
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa danh mục món ăn (Merchant)' })
  @ApiResponse({ status: 200, type: CategoryResponse })
  updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    return this.categoriesService.updateCategory(id, data);
  }

  @Delete(':id')
  @Roles(UserRoles.MERCHANT) // 🟢 CHỈ Merchant mới được xóa
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa danh mục (Merchant)' })
  async deleteCategory(@Param('id') id: string) {
    await this.categoriesService.deleteCategory(id);
    return { deleteItemId: id };
  }
}