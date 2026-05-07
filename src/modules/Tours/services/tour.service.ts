import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from '@/schemas/tour.schema';
import { Restaurant, RestaurantDocument } from '@/schemas/restaurant.schema'; // Import schema quán ăn
import { CreateTourRequest, UpdateTourRequest } from '../dto/tour.dto';
import { TourResponse } from '../dto/response/tour-response';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument> // Tiêm model Restaurant vào để check
  ) { }

  async createTour(data: CreateTourRequest, lang: string = 'vi') {
    // 1. ĐIỀU KIỆN: Giá tour không được âm
    if (data.price < 0) {
      throw new BadRequestException('Giá tour không hợp lệ');
    }

    // 2. ĐIỀU KIỆN: Check các ID quán ăn truyền vào có tồn tại thật hay không?
    if (data.restaurants && data.restaurants.length > 0) {
      const validRestaurants = await this.restaurantModel.countDocuments({ _id: { $in: data.restaurants } });
      if (validRestaurants !== data.restaurants.length) {
        throw new BadRequestException('Một hoặc nhiều ID quán ăn không tồn tại trong hệ thống');
      }
    }

    const newTour = await this.tourModel.create(data);
    return new TourResponse(newTour, lang);
  }

  // 3. ĐIỀU KIỆN: Có Phân trang và Tìm kiếm
  async findAllTours(query: any, lang: string = 'vi') {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { 'name.vi': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } }
      ];
    }

    const [tours, totalItems] = await Promise.all([
      this.tourModel.find(filter).populate('restaurants').sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.tourModel.countDocuments(filter).exec()
    ]);

    return {
      items: tours.map(tour => new TourResponse(tour, lang)), // Áp dụng đa ngôn ngữ
      meta: {
        totalItems, itemCount: tours.length,
        itemsPerPage: limit, totalPages: Math.ceil(totalItems / limit) || 1, currentPage: page
      }
    };
  }

  async findTourById(id: string, lang: string = 'vi') {
    const tour = await this.tourModel.findById(id).populate('restaurants').lean().exec();
    if (!tour) throw new NotFoundException('Không tìm thấy Tour');
    return new TourResponse(tour, lang);
  }

  async updateTour(id: string, data: UpdateTourRequest, lang: string = 'vi') {
    const tour = await this.tourModel.findById(id);
    if (!tour) throw new NotFoundException('Không tìm thấy Tour');

    if (data.price !== undefined && data.price < 0) {
      throw new BadRequestException('Giá tour không hợp lệ');
    }

    if (data.restaurants && data.restaurants.length > 0) {
      const validRestaurants = await this.restaurantModel.countDocuments({ _id: { $in: data.restaurants } });
      if (validRestaurants !== data.restaurants.length) {
        throw new BadRequestException('Một hoặc nhiều ID quán ăn không tồn tại trong hệ thống');
      }
    }

    const updated = await this.tourModel.findByIdAndUpdate(id, data, { new: true }).populate('restaurants').lean().exec();
    return new TourResponse(updated, lang);
  }

  async deleteTour(id: string) {
    const tour = await this.tourModel.findById(id);
    if (!tour) throw new NotFoundException('Không tìm thấy Tour');

    await this.tourModel.findByIdAndDelete(id);
    return { code: 'SUCCESS', message: 'Xóa tour thành công' };
  }
}