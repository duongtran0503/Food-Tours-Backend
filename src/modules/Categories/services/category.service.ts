import { AppException } from '@/common/exceptions/app.exception';
import { CategoryErrorCode } from '@/modules/Categories/config/category-error-code';
import { CreateCategoryRequest } from '@/modules/Categories/dto/request/create-category.request';
import { GetCategoriesQueryRequest } from '@/modules/Categories/dto/request/get-categories-query.request';
import { UpdateCategoryRequest } from '@/modules/Categories/dto/request/update-category.request';
import { CategoryResponse } from '@/modules/Categories/dto/response/category-response';
import { CategoryRepository } from '@/modules/Categories/repositories/category-repository';
import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoryRepository) { }

  async createCategory(data: CreateCategoryRequest, userId: string) {
    const existingCategory = await this.categoriesRepository.findOne({ slug: data.slug });
    if (existingCategory) throw new AppException(CategoryErrorCode.CATEGORY_EXISTED);

    const newCategory = await this.categoriesRepository.create({
      categoryName: data.name, 
      iconUrl: data.icon,
      slug: data.slug,
      owner_id: userId as any, // 👈 Gắn thẻ chủ sở hữu
    });
    return new CategoryResponse(newCategory, 'vi');
  }

  // Xem tất cả (Công khai)
  async findAllCategories(query: GetCategoriesQueryRequest, lang: string) {
    return this.queryCategories({}, query, lang);
  }

  // Xem danh mục của riêng tôi (Merchant)
  async findAllMerchantCategories(userId: string, query: GetCategoriesQueryRequest, lang: string) {
    return this.queryCategories({ owner_id: userId }, query, lang);
  }

  // Hàm query chung để tái sử dụng
  private async queryCategories(baseFilter: any, query: GetCategoriesQueryRequest, lang: string) {
    const { page = 1, limit = 10, search, isActive } = query;
    const skip = (page - 1) * limit;
    const filter: any = { ...baseFilter };

    if (isActive !== undefined) filter.isActive = isActive;
    if (search) {
      filter.$or = [
        { 'categoryName.vi': { $regex: search, $options: 'i' } },
        { 'categoryName.en': { $regex: search, $options: 'i' } },
      ];
    }

    const categoryModel = this.categoriesRepository.getModel();
    const [categories, totalItems] = await Promise.all([
      categoryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      categoryModel.countDocuments(filter).exec(),
    ]);

    const dataFormatted = categories.map((cat) => new CategoryResponse(cat, lang));
    return {
      items: dataFormatted,
      meta: {
        totalItems, itemCount: dataFormatted.length,
        itemsPerPage: limit, totalPages: Math.ceil(totalItems / limit) || 1, currentPage: page,
      },
    };
  }

  async updateCategory(id: string, data: UpdateCategoryRequest, lang: string = 'vi', userId: string, role: string): Promise<CategoryResponse> {
    const categoryToUpdate = await this.categoriesRepository.findById(id);
    if (!categoryToUpdate) throw new AppException(CategoryErrorCode.CATEGORY_NOT_FOUND);
    
    // 👈 KIỂM TRA QUYỀN SỞ HỮU (Admin được bỏ qua)
    if (role !== 'admin' && categoryToUpdate.owner_id?.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa danh mục này');
    }

    const updateData: any = { ...data };
    if (data.name) updateData.categoryName = { ...categoryToUpdate.categoryName, ...data.name };
    if (data.icon) updateData.iconUrl = data.icon;

    const updatedCategory = await this.categoriesRepository.update(id, updateData);
    return new CategoryResponse(updatedCategory, lang);
  }

  async deleteCategory(id: string, userId: string, role: string): Promise<void> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new AppException(CategoryErrorCode.CATEGORY_NOT_FOUND);

    // 👈 KIỂM TRA QUYỀN SỞ HỮU
    if (role !== 'admin' && category.owner_id?.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa danh mục này');
    }

    await this.categoriesRepository.delete(id);
  }
}