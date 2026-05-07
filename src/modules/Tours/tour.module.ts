import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from '@/schemas/tour.schema';
import { Restaurant, RestaurantSchema } from '@/schemas/restaurant.schema'; // 👇 Thêm dòng này
import { TourController } from './controllers/tour.controller';
import { TourService } from './services/tour.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }]) // 👇 Thêm dòng này
  ],
  controllers: [TourController],
  providers: [TourService],
})
export class TourModule {}