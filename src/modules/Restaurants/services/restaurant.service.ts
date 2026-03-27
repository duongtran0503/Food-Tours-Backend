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
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async createRestaurant(data: CreateRestaurantRequest): Promise<RestaurantResponse> {
    const existingRestaurant = await this.restaurantRepository.findOne({
           phoneNumber:data.phoneNumber     
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
      images: data.images || [],
      foods: data.foods ? data.foods.map(id => id as any) : [],
    });

    if (!newRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_CREATE_FAILED);
    }

    return new RestaurantResponse(newRestaurant);
  }


  async findAllPublicRestaurants(query: GetRestaurantsQueryRequest) {
    const { page = 1, limit = 10, search, foodId } = query;
    const skip = (page - 1) * limit;

    const filter: QueryFilter<RestaurantDocument> = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (foodId) {
      filter.foods = foodId as any; 
    }

    const restaurantModel = this.restaurantRepository.getModel();

    const [restaurants, totalItems] = await Promise.all([
      restaurantModel
        .find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      restaurantModel.countDocuments(filter).exec(),
    ]);

    const dataFormatted = restaurants.map((res) => new RestaurantResponse(res as any));

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

  async findRestaurantById(id: string): Promise<RestaurantDetailResponse> {
    const restaurantModel = this.restaurantRepository.getModel();

    const restaurant = await restaurantModel
      .findById(id)
      .populate('foods')
      .lean()
      .exec();

    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    return new RestaurantDetailResponse(restaurant as any);
  }


  async updateRestaurant(id: string, data: UpdateRestaurantRequest): Promise<RestaurantResponse> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.address) updateData.address = data.address;
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
    if (data.openingHours) updateData.openingHours = data.openingHours;
    if (data.images) updateData.images = data.images;
    if (data.foods) updateData.foods = data.foods.map(id => id as any);

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

    return new RestaurantResponse(updatedRestaurant);
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
    data: AddFoodsToRestaurantRequest
  ): Promise<RestaurantResponse> {
    
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const restaurantModel = this.restaurantRepository.getModel();

      
    const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
      restaurantId,
      { 
        $addToSet: { 
          foods: { $each: data.foodIds } 
        } 
      },
      { returnDocument: 'after' } 
    ).lean().exec();

    if (!updatedRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_UPDATE_FAILED);
    }

    return new RestaurantResponse(updatedRestaurant as any);
  }


  async removeFoodsFromRestaurant(
    restaurantId: string, 
    data: RemoveFoodsFromRestaurantRequest
  ): Promise<RestaurantResponse> {
    
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_NOT_FOUND);
    }

    const restaurantModel = this.restaurantRepository.getModel();

    const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
      restaurantId,
      { 
        $pullAll: { 
          foods: data.foodIds as any 
        } 
      },
      { returnDocument: 'after' } 
    ).lean().exec();

    if (!updatedRestaurant) {
      throw new AppException(RestaurantErrorCode.RESTAURANT_UPDATE_FAILED);
    }

    return new RestaurantResponse(updatedRestaurant as any);
  }
}