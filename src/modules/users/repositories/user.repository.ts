import { BaseRepository } from "@/common/repositories/base-repository";
import { User, UserDocument } from "@/schemas/user.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findOneWithPassword(filter: QueryFilter<UserDocument>): Promise<UserDocument | null> {
    return this.userModel
      .findOne(filter)
      .select('+password_hash') 
      .exec();
  }

  async find(filter: QueryFilter<UserDocument>, options?: { skip: number; limit: number }) {
    const query = this.userModel.find(filter);
    if (options) {
      query.skip(options.skip).limit(options.limit);
    }
    return query.exec();
  }

  async count(filter: QueryFilter<UserDocument>) {
    return this.userModel.countDocuments(filter).exec();
  }

  async findByIdAndUpdate(id: string, updateData: any, options?: any) {
    return this.userModel.findByIdAndUpdate(id, updateData, options).exec();
  }

  async findByIdAndDelete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}