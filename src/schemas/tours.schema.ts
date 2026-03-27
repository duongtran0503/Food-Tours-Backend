import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


@Schema({ _id: false })
class TourStop {
  @Prop({ required: true, type: Types.ObjectId, ref: 'POI' })
  poi: Types.ObjectId;

  @Prop({ required: true }) 
  visitOrder: number;
}

@Schema({ timestamps: true, collection: 'tours' })
export class Tour {
  @Prop({ required: true, trim: true }) 
  tourName: string;

  @Prop() 
  description: string;

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