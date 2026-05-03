import { MultiLanguage } from '@/schemas/MultiLanguage';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';



@Schema({ timestamps: true, collection: 'restaurants' })
export class Restaurant {
  @Prop({ type: Object, required: true })
  name: MultiLanguage;

  @Prop({ type: Object, required: true })
  address: MultiLanguage;

  @Prop({ type: Object, required: true })
  description: MultiLanguage;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner_id: Types.ObjectId;

  @Prop({ type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;
  
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

  @Prop({ type: Object, required: true })
  openingHours: MultiLanguage;

  @Prop({ default: [] })
  images: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Food' }], default: [] })
  foods: Types.ObjectId[];
}

export type RestaurantDocument = HydratedDocument<Restaurant>;
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);