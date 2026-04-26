import { AppException } from '@/common/exceptions/app.exception';
import { RestaurantErrorCode } from '@/modules/Restaurants/config/restaurant-error-code';
import { AddFoodsToRestaurantRequest } from '@/modules/Restaurants/dto/request/add-foods-restaurant.request';
import { CreateRestaurantRequest } from '@/modules/Restaurants/dto/request/create-restaurant.request';
import { GetRestaurantsQueryRequest } from '@/modules/Restaurants/dto/request/get-restaurants-query.request';
import { RemoveFoodsFromRestaurantRequest } from '@/modules/Restaurants/dto/request/remove-foods-restaurant.request';
import { UpdateRestaurantRequest } from '@/modules/Restaurants/dto/request/update-restaurant.request';
import { RestaurantDetailResponse } from '@/modules/Restaurants/dto/response/restaurant-detail-response';
import { RestaurantResponse } from '@/modules/Restaurants/dto/response/restaurant-response';
import { RestaurantRepository } from '@/modules/Restaurants/repositories/restaurant.repository';
import { RestaurantDocument } from '@/schemas/restaurant.schema';
import { Injectable } from '@nestjs/common';
import { QueryFilter } from 'mongoose';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) { }

  async createRestaurant(data: CreateRestaurantRequest, userId: string): Promise<RestaurantResponse> {
    const existingRestaurant = await this.restaurantRepository.findOne({
      phoneNumber: data.phoneNumber,
    });

    if (existingRestaurant) {
      throw new AppException(RestaurantErrorCode.PHONE_RESTAURANT_EXISTED);
    }

    const newRestaurant = await this.restaurantRepository.create({
      name: data.name,
      address: data.address,
      location: data.location,
      phoneNumber: data.phoneNumber,
      openingHours: data.openingHours,
      description: data.description,
      images: data.images || [],
      foods: data.foods ? data.foods.map((id) => id as any) : [],
      owner_id: userId,          // Lấy ID của Merchant đang đăng nhập
      status: 'pending',         // Mặc định tạo ra là chờ duyệt
    } as any);

    if (!newRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_CREATE_FAILED);
    }

    return new RestaurantResponse(newRestaurant as any, 'vi');
  }

  // 2. Thêm hàm mới: Admin duyệt cửa hàng
  async approveRestaurant(id: string, status: 'approved' | 'rejected', lang: string = 'vi'): Promise<RestaurantResponse> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const updatedRestaurant = await this.restaurantRepository.update(id, { status } as any);
    if (!updatedRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_UPDATE_FAILED);
    }

    return new RestaurantResponse(updatedRestaurant as any, lang);
  }

  async findAllPublicRestaurants(query: GetRestaurantsQueryRequest, lang: string = 'vi') {
    const { page = 1, limit = 10, search, foodId } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // FIX: Search vào các trường con của MultiLanguage
    if (search) {
      filter.$or = [
        { 'name.vi': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
      ];
    }

    if (foodId) {
      filter.foods = foodId as any;
    }

    const restaurantModel = this.restaurantRepository.getModel();

    const [restaurants, totalItems] = await Promise.all([
      restaurantModel
        .find(filter)
        .sort({ 'name.vi': 1 }) // Sắp xếp theo tên tiếng Việt
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      restaurantModel.countDocuments(filter).exec(),
    ]);

    const dataFormatted = restaurants.map((res) => new RestaurantResponse(res as any, lang));

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

  async findRestaurantById(id: string, lang: string = 'vi'): Promise<RestaurantDetailResponse> {
    const restaurantModel = this.restaurantRepository.getModel();

    const restaurant = await restaurantModel
      .findById(id)
      .populate('foods')
      .lean()
      .exec();

    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    return new RestaurantDetailResponse(restaurant as any, lang);
  }

  async updateRestaurant(id: string, data: UpdateRestaurantRequest, lang: string = 'vi'): Promise<RestaurantResponse> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const updateData: any = {};

    // FIX: Merge dữ liệu cũ và mới để tránh mất các ngôn ngữ không truyền lên
    if (data.name) updateData.name = { ...restaurant.name, ...data.name };
    if (data.address) updateData.address = { ...restaurant.address, ...data.address };
    if (data.openingHours) updateData.openingHours = { ...restaurant.openingHours, ...data.openingHours };
    if (data.description) updateData.description = { ...restaurant.description, ...data.description };
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
    if (data.images) updateData.images = data.images;
    if (data.foods) updateData.foods = data.foods.map((id) => id as any);

    if (data.location) {
      updateData.location = {
        lat: data.location.lat !== undefined ? data.location.lat : restaurant.location.lat,
        lng: data.location.lng !== undefined ? data.location.lng : restaurant.location.lng,
      };
    }

    const updatedRestaurant = await this.restaurantRepository.update(id, updateData);
    if (!updatedRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_UPDATE_FAILED);
    }

    return new RestaurantResponse(updatedRestaurant, lang);
  }

  async deleteRestaurant(id: string): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const deletedResult = await this.restaurantRepository.delete(id);
    if (!deletedResult) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_DELETE_FAILED);
    }
  }

  async addFoodsToRestaurant(
    restaurantId: string,
    data: AddFoodsToRestaurantRequest,
    lang: string = 'vi'
  ): Promise<RestaurantResponse> {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const restaurantModel = this.restaurantRepository.getModel();

    const updatedRestaurant = await restaurantModel
      .findByIdAndUpdate(
        restaurantId,
        {
          $addToSet: {
            foods: { $each: data.foodIds },
          },
        },
        { returnDocument: 'after' },
      )
      .lean()
      .exec();

    if (!updatedRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_UPDATE_FAILED);
    }

    return new RestaurantResponse(updatedRestaurant as any, lang);
  }

  async removeFoodsFromRestaurant(
    restaurantId: string,
    data: RemoveFoodsFromRestaurantRequest,
    lang: string = 'vi'
  ): Promise<RestaurantResponse> {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const restaurantModel = this.restaurantRepository.getModel();

    const updatedRestaurant = await restaurantModel
      .findByIdAndUpdate(
        restaurantId,
        {
          $pullAll: {
            foods: data.foodIds as any,
          },
        },
        { returnDocument: 'after' },
      )
      .lean()
      .exec();

    if (!updatedRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_UPDATE_FAILED);
    }

    return new RestaurantResponse(updatedRestaurant as any, lang);
  }
}