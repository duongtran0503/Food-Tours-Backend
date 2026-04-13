import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  BANNED_TEMPORARY = 'BANNED_TEMPORARY',
  BANNED_PERMANENT = 'BANNED_PERMANENT',
}

export enum UserRoles {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER"
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) 
  email: string;

  @Prop({ required: true, select: false })
  password_hash: string;

  @Prop({ required: true, trim: true }) 
  fullName: string;

  @Prop({ trim: true })
  phoneNumber?: string;

  @Prop({ default: UserRoles.CUSTOMER, type: String, enum: Object.values(UserRoles) })
  role: UserRoles;

  @Prop({ 
    type: String, 
    default: UserStatus.ACTIVE, 
    enum: Object.values(UserStatus) 
  })
  status: UserStatus;

  @Prop({ default: 'https://www.gravatar.com/avatar/?d=mp' })
  avatar?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);