import { FoodController } from "@/modules/Foods/controllers/food.controller";
import { FoodRepository } from "@/modules/Foods/repositories/food.repository";
import { FoodService } from "@/modules/Foods/services/food.service";
import { Food, FoodSchema } from "@/schemas/foods.chema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Food.name,
                schema: FoodSchema
            }
        ])
    ],
    controllers: [FoodController],
    providers: [FoodService, FoodRepository]
})
export class FoodModule { }