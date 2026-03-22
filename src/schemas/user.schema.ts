import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true, 
   collection: 'users',
})
export class User {
@Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true,select:false })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 'CUSTOMER', enum: ['CUSTOMER', 'ADMIN'] }) 
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' })
  avatar: string;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
