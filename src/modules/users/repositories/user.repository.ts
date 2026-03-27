import { BaseRepository } from "@/common/repositories/base-repository";
import {  User, UserDocument } from "@/schemas/user.schema";
import {Injectable} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";
@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
 constructor(@InjectModel(User.name) private userModel:Model<UserDocument>) {
    super(userModel)
 }

 async findOneWithPassword(filter: QueryFilter<UserDocument>): Promise<UserDocument | null> {
    return this.userModel
      .findOne(filter)
      .select('+password_hash') 
      .exec();
 }
}