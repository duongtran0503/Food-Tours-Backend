import { BaseRepository } from "@/common/repositories/base-repository";
import { Restaurant, RestaurantDocument } from "@/schemas/restaurant.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RestaurantRepository extends BaseRepository<RestaurantDocument> {
    constructor(@InjectModel(Restaurant.name) private restaurantModel:Model<RestaurantDocument>) {
        super(restaurantModel)
    }
}