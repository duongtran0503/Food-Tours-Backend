import { CategoryController } from "@/modules/Categories/controllers/category.controller";
import { CategoryRepository } from "@/modules/Categories/repositories/category-repository";
import { CategoriesService } from "@/modules/Categories/services/category.service";
import { FoodCategory, FoodCategorySchema } from "@/schemas/food-categories.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
     imports:[MongooseModule.forFeature([
            {
                name: FoodCategory.name,
                schema: FoodCategorySchema
            }
        ])],
    controllers:[CategoryController],
    providers:[CategoriesService,CategoryRepository]
})
export class CategoriesModule {}