import { MultiLanguage } from '@/schemas/MultiLanguage';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum FoodStatus {
  AVAILABLE = "AVAILABLE",
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

@Schema({ timestamps: true, collection: 'Foods' })
export class Food {
  // Áp dụng đa ngôn ngữ cho tên món ăn
  @Prop({ type: MultiLanguage, required: true })
  dishName: MultiLanguage;

  // Trong các file Schema tương ứng
@Prop({ type: Types.ObjectId, ref: 'User', required: true })
owner_id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: MultiLanguage, required: true })
  description: MultiLanguage;

  @Prop({ required: true, type: Types.ObjectId, ref: 'FoodCategory' })
  category: Types.ObjectId;

  @Prop({ default: [] })
  images: string[];

  @Prop({ required: true, min: 0 })
  minPrice: number;

  @Prop({ required: true, min: 0 })
  maxPrice: number;

  @Prop({ default: FoodStatus.AVAILABLE, type: String, enum: FoodStatus })
  status: FoodStatus;
}

export type FoodDocument = HydratedDocument<Food>;
export const FoodSchema = SchemaFactory.createForClass(Food);