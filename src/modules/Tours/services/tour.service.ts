import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from '@/schemas/tour.schema';
import { CreateTourRequest } from '../dto/tour.dto';

@Injectable()
export class TourService {
  constructor(@InjectModel(Tour.name) private tourModel: Model<TourDocument>) {}

  async createTour(data: CreateTourRequest) {
    const newTour = await this.tourModel.create(data);
    return { code: 'SUCCESS', message: 'Tạo tour thành công', data: newTour };
  }

  async findAllTours() {
    const tours = await this.tourModel.find().populate('restaurants').lean().exec();
    return { items: tours, meta: { totalItems: tours.length } };
  }

  async findTourById(id: string) {
    const tour = await this.tourModel.findById(id).populate('restaurants').lean().exec();
    if (!tour) throw new NotFoundException('Không tìm thấy Tour');
    return { data: tour };
  }

  async updateTour(id: string, data: any) {
    const updated = await this.tourModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new NotFoundException('Không tìm thấy Tour');
    return { code: 'SUCCESS', message: 'Cập nhật thành công', data: updated };
  }

  async deleteTour(id: string) {
    await this.tourModel.findByIdAndDelete(id);
    return { code: 'SUCCESS', message: 'Xóa tour thành công' };
  }
}