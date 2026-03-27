import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'food_categories' })
export class FoodCategory {
  @Prop({ required: true, trim: true }) 
  categoryName: string;

   @Prop({ required: true,unique:true, trim: true }) 
  slug: string;

  @Prop() 
  iconUrl: string;

  @Prop({default:true})
  isActive:boolean

}

export type FoodCategoryDocument = HydratedDocument<FoodCategory>;
export const FoodCategorySchema = SchemaFactory.createForClass(FoodCategory);