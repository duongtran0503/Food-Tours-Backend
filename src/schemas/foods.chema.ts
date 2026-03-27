import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export enum FoodStatus {
  AVAILABLE = "AVAILABLE",
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}
@Schema({ timestamps: true, collection: 'Foods' })

export class Food {
  @Prop({ required: true, trim: true }) 
  dishName: string;

  @Prop({ required: true,unique:true })
  slug: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'FoodCategory' })
  category: Types.ObjectId;



  @Prop({ default: [] })
  images: string[];

  @Prop({ required: true, min: 0 }) 
  minPrice: number;

  @Prop({ required: true, min: 0 }) 
  maxPrice: number;

  @Prop({ default: FoodStatus.AVAILABLE,type:String, enum:FoodStatus })
  status: FoodStatus;

 
}

export type FoodDocument = HydratedDocument<Food>;
export const FoodSchema = SchemaFactory.createForClass(Food);