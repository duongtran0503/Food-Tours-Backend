import { AppException } from '@/common/exceptions/app.exception';
import { CategoryErrorCode } from '@/modules/Categories/config/category-error-code';
import { CreateCategoryRequest } from '@/modules/Categories/dto/request/create-category.request';
import { GetCategoriesQueryRequest } from '@/modules/Categories/dto/request/get-categories-query.request';
import { UpdateCategoryRequest } from '@/modules/Categories/dto/request/update-category.request';
import { CategoryResponse } from '@/modules/Categories/dto/response/category-response';
import { CategoryRepository } from '@/modules/Categories/repositories/category-repository';
import { FoodCategory, FoodCategoryDocument } from '@/schemas/food-categories.schema';
import { Injectable } from '@nestjs/common';
import { QueryFilter } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoryRepository) {}

  async createCategory(data: CreateCategoryRequest) {
    const existingCategory = await this.categoriesRepository.findOne({ name: data.slug });
    
    if (existingCategory) {
      throw new AppException(CategoryErrorCode.CATEGORY_EXISTED);
    }
   const newCategory = await this.categoriesRepository.create({
        categoryName:data.name,
        iconUrl:data.icon,
        slug:data.slug,
        
    });
    return new CategoryResponse(newCategory);
  }


  async findAllCategories(query: GetCategoriesQueryRequest) {
    const { page = 1, limit = 10, search, isActive } = query;
    const skip = (page - 1) * limit;

    const filter: QueryFilter<FoodCategoryDocument> = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (search) {
      filter.categoryName = { $regex: search, $options: 'i' };
    }

    const categoryModel = this.categoriesRepository.getModel();

    const [categories, totalItems] = await Promise.all([
      categoryModel.find(filter).sort({ categoryName: 1 }).skip(skip).limit(limit).lean().exec(),
      categoryModel.countDocuments(filter).exec(),
    ]);

    const dataFormatted = categories.map((cat) => new CategoryResponse(cat));

    return {
      items: dataFormatted,
      meta: {
        totalItems,
        itemCount: dataFormatted.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit) || 1, 
        currentPage: page,
      },
    };
  }


  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> {
    const categoryToUpdate = await this.categoriesRepository.findById(id);
    if (!categoryToUpdate) {
      throw new AppException(CategoryErrorCode.CATEGORY_NOT_FOUND);
    }

    if (data.slug) {
      const existingWithSlug = await this.categoriesRepository.findOne({
        slug: data.slug,
        _id: { $ne: id }, 
      });

      if (existingWithSlug) {
        throw new AppException(CategoryErrorCode.CATEGORY_EXISTED);
      }
    }

    const updateData =categoryToUpdate;
    if (data.name) updateData.categoryName = data.name;
    if (data.slug) updateData.slug = data.slug;
    if (data.icon) updateData.iconUrl = data.icon;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updatedCategory = await this.categoriesRepository.update(id, updateData);
    if (!updatedCategory) {
      throw new AppException(CategoryErrorCode.CATEGORY_UPDATE_FAILED);
    }

    return new CategoryResponse(updatedCategory);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new AppException(CategoryErrorCode.CATEGORY_NOT_FOUND);
    }

    const deletedResult = await this.categoriesRepository.delete(id);
    if (!deletedResult) {
      throw new AppException(CategoryErrorCode.CATEGORY_DELETE_FAILED);
    }
  }
}