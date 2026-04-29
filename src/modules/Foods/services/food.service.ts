import { AppException } from '@/common/exceptions/app.exception';
import { FoodErrorCode } from '@/modules/Foods/config/food.error.code';
import { CreateFoodRequest } from '@/modules/Foods/dto/request/create-food.request';
import { GetFoodsQueryRequest } from '@/modules/Foods/dto/request/get-foods-query.request';
import { UpdateFoodRequest } from '@/modules/Foods/dto/request/update-food.request';
import { FoodResponse } from '@/modules/Foods/dto/response/food-response.dto';
import { FoodRepository } from '@/modules/Foods/repositories/food.repository';
import { FoodDocument, FoodStatus } from '@/schemas/foods.chema';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { QueryFilter } from 'mongoose';

@Injectable()
export class FoodService {
  constructor(private readonly foodRepository: FoodRepository) { }

  async createFood(data: CreateFoodRequest, userId: string): Promise<FoodResponse> {
    if (data.minPrice > data.maxPrice) throw new AppException(FoodErrorCode.INVALID_PRICE_RANGE);

    const existingFood = await this.foodRepository.findOne({ slug: data.slug });
    if (existingFood) throw new AppException(FoodErrorCode.FOOD_EXISTED_IN_POI);

    const newFood = await this.foodRepository.create({
      dishName: data.name,
      slug: data.slug,
      category: data.category as any,
      minPrice: data.minPrice,
      description: data.description,
      maxPrice: data.maxPrice,
      images: data.images || [],
      status: FoodStatus.AVAILABLE,
      owner_id: userId as any, // 👈 Gắn thẻ chủ quán
    });
    return new FoodResponse(newFood, 'vi');
  }

  // Công khai
  async findAllPublicFoods(query: GetFoodsQueryRequest, lang: string = 'vi') {
    return this.queryFoods({ status: FoodStatus.AVAILABLE }, query, lang);
  }

  // Của riêng tôi (Merchant)
  async findAllMerchantFoods(userId: string, query: GetFoodsQueryRequest, lang: string = 'vi') {
    return this.queryFoods({ owner_id: userId }, query, lang);
  }

  private async queryFoods(baseFilter: any, query: GetFoodsQueryRequest, lang: string) {
    const { page = 1, limit = 10, search, categoryId } = query;
    const filter: QueryFilter<FoodDocument> = { ...baseFilter };

    if (categoryId) filter.category = categoryId as any;
    if (search) {
      filter.$or = [
        { 'dishName.vi': { $regex: search, $options: 'i' } },
        { 'dishName.en': { $regex: search, $options: 'i' } }
      ];
    }

    const [foods, totalItems] = await Promise.all([
      this.foodRepository.getModel().find(filter).sort({ 'dishName.vi': 1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.foodRepository.getModel().countDocuments(filter).exec(),
    ]);

    return {
      items: foods.map((food) => new FoodResponse(food, lang)),
      meta: { totalItems, itemsPerPage: limit, currentPage: page, totalPages: Math.ceil(totalItems / limit) || 1 },
    };
  }

  async findFoodById(id: string, lang: string = "vi"): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(id);
    if (!food) throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    return new FoodResponse(food, lang);
  }

  async updateFood(id: string, data: UpdateFoodRequest, lang: string = 'vi', userId: string, role: string): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(id);
    if (!food) throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);

    // 👈 KIỂM TRA QUYỀN SỞ HỮU
    if (role !== 'admin' && food.owner_id?.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa món ăn này');
    }

    const finalMinPrice = data.minPrice !== undefined ? data.minPrice : food.minPrice;
    const finalMaxPrice = data.maxPrice !== undefined ? data.maxPrice : food.maxPrice;
    if (finalMinPrice > finalMaxPrice) throw new AppException(FoodErrorCode.INVALID_PRICE_RANGE);

    const updateData: any = {};
    if (data.name) updateData.dishName = { ...food.dishName, ...data.name };
    if (data.description) updateData.description = { ...food.description, ...data.description };
    if (data.category) updateData.category = data.category as any;
    if (data.images) updateData.images = data.images;
    if (data.minPrice !== undefined) updateData.minPrice = data.minPrice;
    if (data.maxPrice !== undefined) updateData.maxPrice = data.maxPrice;
    if (data.status) updateData.status = data.status;
    if (data.slug) updateData.slug = data.slug;

    const updatedFood = await this.foodRepository.update(id, updateData);
    return new FoodResponse(updatedFood, lang);
  }

  async deleteFood(id: string, userId: string, role: string): Promise<void> {
    const food = await this.foodRepository.findById(id);
    if (!food) throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);

    // 👈 KIỂM TRA QUYỀN SỞ HỮU
    if (role !== 'admin' && food.owner_id?.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa món ăn này');
    }
    await this.foodRepository.delete(id);
  }

  // Add và Remove category cũng áp dụng kiểm tra quyền tương tự
  async addCategoryToFood(foodId: string, categoryId: string, lang: string = 'vi', userId: string, role: string): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(foodId);
    if (!food) throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    if (role !== 'admin' && food.owner_id?.toString() !== userId) throw new ForbiddenException('Không có quyền');

    const updatedFood = await this.foodRepository.getModel().findByIdAndUpdate(foodId, { $set: { category: categoryId } }, { returnDocument: 'after' }).lean().exec();
    return new FoodResponse(updatedFood as any, lang);
  }

  async removeCategoryFromFood(foodId: string, lang: string = 'vi', userId: string, role: string): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(foodId);
    if (!food) throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    if (role !== 'admin' && food.owner_id?.toString() !== userId) throw new ForbiddenException('Không có quyền');

    const updatedFood = await this.foodRepository.getModel().findByIdAndUpdate(foodId, { $set: { category: '' } }, { returnDocument: 'after' }).lean().exec();
    return new FoodResponse(updatedFood as any, lang);
  }
}