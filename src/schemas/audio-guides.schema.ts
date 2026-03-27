import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'audio_guides' })
export class AudioGuide {
  @Prop({ required: true, type: Types.ObjectId, ref: 'POI' })
  poi: Types.ObjectId;

  @Prop({ required: true, trim: true })
  audioTitle: string;

  @Prop({ required: true }) 
  audioUrl: string;

  @Prop({ required: true, enum: ['VI', 'EN'], default: 'VI' }) 
  language: string;

  @Prop({ default: 0 }) 
  listenCount: number;
}

export type AudioGuideDocument = HydratedDocument<AudioGuide>;
export const AudioGuideSchema = SchemaFactory.createForClass(AudioGuide);