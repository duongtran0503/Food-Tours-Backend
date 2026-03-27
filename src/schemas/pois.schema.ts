import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'pois' })
export class POI {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true }) 
  description: string;

  @Prop({ required: true }) 
  address: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
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

// Đánh chỉ mục 2dsphere để tìm kiếm theo bán kính/khoảng cách địa lý
POISchema.index({ location: '2dsphere' });