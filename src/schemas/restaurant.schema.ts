import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


@Schema({ timestamps: true, collection: 'restaurants' })
export class Restaurant {
  @Prop({ required: true, trim: true })
  name: string; // Tên quán (Ví dụ: Quán Cao lầu Thanh, Phở Thìn...)

  @Prop({ required: true })
  address: string; // Địa chỉ quán ăn

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  })
  location: { lat: number; lng: number }; // GPS tọa độ quán ăn

  @Prop({required:true,unique:true})
  phoneNumber: string;

  @Prop()
  openingHours: string; // Ví dụ: "07:00 - 22:00"

  @Prop({ default: [] })
  images: string[];



  @Prop({ type: [{ type: Types.ObjectId, ref: 'Food' }], default: [] })
  foods: Types.ObjectId[];
}
export type RestaurantDocument = HydratedDocument<Restaurant>;

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);