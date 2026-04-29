import { Public } from "@/common/decorator/is.public";
import { Roles } from "@/common/decorator/roles.decorator";
import { CreateCategoryRequest } from "@/modules/Categories/dto/request/create-category.request";
import { GetCategoriesQueryRequest } from "@/modules/Categories/dto/request/get-categories-query.request";
import { UpdateCategoryRequest } from "@/modules/Categories/dto/request/update-category.request";
import { CategoryResponse } from "@/modules/Categories/dto/response/category-response";
import { CategoriesService } from "@/modules/Categories/services/category.service";
import { UserRoles } from "@/schemas/user.schema";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Headers, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Categories')
@Controller("categories")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo danh mục món ăn mới (Admin/Merchant)' })
  create(@Body() data: CreateCategoryRequest, @Req() req: any) {
    return this.categoriesService.createCategory(data, req.user.userId);
  }

  // 👇 API MỚI: Dành cho Merchant lấy danh mục của riêng mình
  @Get('me')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem danh mục của tôi (Merchant)' })
  getMyCategories(@Query() query: GetCategoriesQueryRequest, @Req() req: any, @Headers('lang') lang: string = 'vi') {
    return this.categoriesService.findAllMerchantCategories(req.user.userId, query, lang);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách danh mục phân trang (Công khai)' })
  getCategories(@Query() query: GetCategoriesQueryRequest, @Headers('lang') lang: string = 'vi') {
    return this.categoriesService.findAllCategories(query, lang);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa danh mục món ăn (Admin/Merchant)' })
  updateCategory(@Param('id') id: string, @Body() data: UpdateCategoryRequest, @Req() req: any): Promise<CategoryResponse> {
    return this.categoriesService.updateCategory(id, data, 'vi', req.user.userId, req.user.role);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa danh mục (Admin/Merchant)' })
  async deleteCategory(@Param('id') id: string, @Req() req: any) {
    await this.categoriesService.deleteCategory(id, req.user.userId, req.user.role);
    return { deleteItemId: id };
  }
}