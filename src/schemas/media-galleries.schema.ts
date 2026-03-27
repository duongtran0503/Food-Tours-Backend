import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'media_galleries' })
export class MediaGallery {
  @Prop({ required: true, type: Types.ObjectId, ref: 'POI' })
  poi: Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop() 
  imageTitle: string;

  @Prop({ default: false }) 
  isCover: boolean;

  
}

export type MediaGalleryDocument = HydratedDocument<MediaGallery>;
export const MediaGallerySchema = SchemaFactory.createForClass(MediaGallery);