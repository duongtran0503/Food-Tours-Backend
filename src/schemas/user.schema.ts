import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true, 
   collection: 'users',
})
export class User {
@Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 'USER' }) 
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  avatar?: string;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
