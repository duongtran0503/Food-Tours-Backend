import { MultiLanguage } from '@/schemas/MultiLanguage';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'pois' })
export class POI {
  // 1. Tên địa điểm đa ngôn ngữ
  @Prop({ type: MultiLanguage, required: true })
  name: MultiLanguage;

  // 2. Mô tả địa điểm đa ngôn ngữ
  @Prop({ type: MultiLanguage, required: true })
  description: MultiLanguage;

  // 3. Địa chỉ địa điểm đa ngôn ngữ
  @Prop({ type: MultiLanguage, required: true })
  address: MultiLanguage;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: { type: [Number], required: true },
  })
  location: { type: string; coordinates: number[] };

  @Prop({ required: true, enum: ['EATERY', 'DRINK', 'CHECKIN', 'UTILITY'] })
  type: string;

  @Prop()
  hotline: string;

  @Prop({ default: '#FF0000' })
  mapColorTag: string;

  @Prop({ default: true })
  isLayerVisible: boolean;
}

export type POIDocument = HydratedDocument<POI>;
export const POISchema = SchemaFactory.createForClass(POI);

// Đánh chỉ mục địa lý 2dsphere
POISchema.index({ location: '2dsphere' });