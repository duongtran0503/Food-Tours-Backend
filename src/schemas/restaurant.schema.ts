import { MultiLanguage } from '@/schemas/MultiLanguage';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';



@Schema({ timestamps: true, collection: 'restaurants' })
export class Restaurant {
  // 1. Tên quán đa ngôn ngữ
  @Prop({ type: MultiLanguage, required: true })
  name: MultiLanguage;

  // 2. Địa chỉ đa ngôn ngữ
  @Prop({ type: MultiLanguage, required: true })
  address: MultiLanguage;

  @Prop({ type: MultiLanguage, required: true })
  description: MultiLanguage;

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  })
  location: { lat: number; lng: number };

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  // 3. Giờ mở cửa đa ngôn ngữ (Đề phòng có các ghi chú như "Chủ nhật đóng cửa")
  @Prop({ type: MultiLanguage, required: true })
  openingHours: MultiLanguage;

  @Prop({ default: [] })
  images: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Food' }], default: [] })
  foods: Types.ObjectId[];
}

export type RestaurantDocument = HydratedDocument<Restaurant>;
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);