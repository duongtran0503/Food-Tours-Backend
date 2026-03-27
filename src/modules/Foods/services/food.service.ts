import { AppException } from '@/common/exceptions/app.exception';
import { FoodErrorCode } from '@/modules/Foods/config/food.error.code';
import { CreateFoodRequest } from '@/modules/Foods/dto/request/create-food.request';
import { GetFoodsQueryRequest } from '@/modules/Foods/dto/request/get-foods-query.request';
import { UpdateFoodRequest } from '@/modules/Foods/dto/request/update-food.request';
import { FoodResponse } from '@/modules/Foods/dto/response/food-response.dto';
import { FoodRepository } from '@/modules/Foods/repositories/food.repository';
import { FoodDocument, FoodStatus } from '@/schemas/foods.chema';
import { Injectable } from '@nestjs/common';
import { QueryFilter } from 'mongoose';


@Injectable()
export class FoodService {
  constructor(private readonly foodRepository: FoodRepository) {}

  async createFood(data: CreateFoodRequest): Promise<FoodResponse> {
    if (data.minPrice > data.maxPrice) {
      throw new AppException(FoodErrorCode.INVALID_PRICE_RANGE);
    }

    const existingFood = await this.foodRepository.findOne({
         slug:data.slug      
    });

    if (existingFood) {
      throw new AppException(FoodErrorCode.FOOD_EXISTED_IN_POI);
    }

    const newFood = await this.foodRepository.create({
      dishName: data.name,
      slug:data.slug,
      category: data.category as any,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      images: data.images || [],
      status: FoodStatus.AVAILABLE,
    });

    if (!newFood) {
      throw new AppException(FoodErrorCode.FOOD_CREATE_FAILED);
    }

    return new FoodResponse(newFood);
  }


  async findAllPublicFoods(query: GetFoodsQueryRequest) {
    const { page = 1, limit = 10, search, categoryId: categoryId } = query;
    const skip = (page - 1) * limit;

    const filter: QueryFilter<FoodDocument> = {
      status: FoodStatus.AVAILABLE,
    };

    if (categoryId) {
      filter.category = categoryId as any;
    }

    if (search) {
      filter.dishName = { $regex: search, $options: 'i' };
    }

    const foodModel = this.foodRepository.getModel();

    const [foods, totalItems] = await Promise.all([
      foodModel
        .find(filter)
        .sort({ dishName: 1 }) 
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      foodModel.countDocuments(filter).exec(),
    ]);

    const dataFormatted = foods.map((food) => new FoodResponse(food as any));

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

  async findFoodById(id: string): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(id);

    if (!food) {
      throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    }

    return new FoodResponse(food);
  }

  async updateFood(id: string, data: UpdateFoodRequest): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(id);
    if (!food) {
      throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    }

    const finalMinPrice = data.minPrice !== undefined ? data.minPrice : food.minPrice;
    const finalMaxPrice = data.maxPrice !== undefined ? data.maxPrice : food.maxPrice;

    if (finalMinPrice > finalMaxPrice) {
      throw new AppException(FoodErrorCode.INVALID_PRICE_RANGE);
    }

    const updateData: any = {};
    if (data.name) updateData.dishName = data.name;
    if (data.category) updateData.category = data.category as any;
    if (data.images) updateData.images = data.images;
    if (data.minPrice !== undefined) updateData.minPrice = data.minPrice;
    if (data.maxPrice !== undefined) updateData.maxPrice = data.maxPrice;
    if (data.status) updateData.status = data.status;
    if(data.slug) updateData.slug = data.slug

    const updatedFood = await this.foodRepository.update(id, updateData);
    if (!updatedFood) {
      throw new AppException(FoodErrorCode.FOOD_UPDATE_FAILED);
    }

    return new FoodResponse(updatedFood);
  }

  async deleteFood(id: string): Promise<void> {
    const food = await this.foodRepository.findById(id);
    if (!food) {
      throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    }

    const deletedResult = await this.foodRepository.delete(id);
    if (!deletedResult) {
      throw new AppException(FoodErrorCode.FOOD_DELETE_FAILED);
    }
  }

  async addCategoryToFood(foodId: string, categoryId: string): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(foodId);
    if (!food) {
      throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    }

    const foodModel = this.foodRepository.getModel();

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
     { $set: { category: categoryId } }, 
  { returnDocument: 'after' } 
    ).lean().exec();

    return new FoodResponse(updatedFood as any);
  }

  async removeCategoryFromFood(foodId: string): Promise<FoodResponse> {
    const food = await this.foodRepository.findById(foodId);
    if (!food) {
      throw new AppException(FoodErrorCode.FOOD_NOT_FOUND);
    }

    const foodModel = this.foodRepository.getModel();
   const updatedFood = await foodModel.findByIdAndUpdate(
  foodId,
  { $set: { category: '' } }, 
  { returnDocument: 'after' } 
).lean().exec();

    return new FoodResponse(updatedFood as any);
  }
}