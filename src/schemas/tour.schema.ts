import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MultiLanguage } from '@/schemas/MultiLanguage'; // Tận dụng lại bộ đa ngôn ngữ

export type TourDocument = HydratedDocument<Tour>;

@Schema({ timestamps: true, collection: 'tours' })
export class Tour {
  @Prop({ type: MultiLanguage, required: true })
  name: MultiLanguage;

  @Prop({ type: MultiLanguage, required: true })
  description: MultiLanguage;

  @Prop({ required: true })
  price: number; // Giá vé của Tour

  @Prop({ required: true })
  duration: string; // Thời lượng tour (VD: "3 hours", "Nửa ngày")

  // Liên kết với bảng Restaurants: Tour này sẽ đi ăn ở những quán nào?
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Restaurant' }], default: [] })
  restaurants: Types.ObjectId[];

  @Prop({ default: [] })
  images: string[];
}

export const TourSchema = SchemaFactory.createForClass(Tour);