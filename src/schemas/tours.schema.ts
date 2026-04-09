import { MultiLanguage } from '@/schemas/MultiLanguage';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


@Schema({ _id: false })
class TourStop {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant' })
  poi: Types.ObjectId;

  @Prop({ required: true })
  visitOrder: number;
}

@Schema({ timestamps: true, collection: 'tours' })
export class Tour {
  // 1. Tên tour đa ngôn ngữ
  @Prop({ type: MultiLanguage, required: true })
  tourName: MultiLanguage;

  // 2. Mô tả tour đa ngôn ngữ
  @Prop({ type: MultiLanguage, required: true })
  description: MultiLanguage;

  @Prop({ type: [TourStop], default: [] })
  stops: TourStop[];

  @Prop({ default: 0 })
  estimatedTimeMinutes: number;

  @Prop({ default: 0 })
  totalDistanceKm: number;

  @Prop({ default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;
}

export type TourDocument = HydratedDocument<Tour>;
export const TourSchema = SchemaFactory.createForClass(Tour);