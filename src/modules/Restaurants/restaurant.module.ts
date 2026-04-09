import { RestaurantController } from "@/modules/Restaurants/controllers/restaurant.controller";
import { RestaurantRepository } from "@/modules/Restaurants/repositories/restaurant.repository";
import { RestaurantService } from "@/modules/Restaurants/services/restaurant.service";
import { Restaurant, RestaurantSchema } from "@/schemas/restaurant.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: Restaurant.name,
            schema: RestaurantSchema
        }
    ])],
    controllers: [RestaurantController],
    providers: [RestaurantService, RestaurantRepository]
})
export class RestaurantModule { }