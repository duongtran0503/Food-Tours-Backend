import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from '@/schemas/tour.schema';
import { TourController } from './controllers/tour.controller';
import { TourService } from './services/tour.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }])],
  controllers: [TourController],
  providers: [TourService],
})
export class TourModule {}