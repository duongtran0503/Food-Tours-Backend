import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from "@/common/repositories/base-repository";
import { FoodCategory, FoodCategoryDocument } from "@/schemas/food-categories.schema";
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository extends BaseRepository<FoodCategoryDocument> {
     constructor(@InjectModel(FoodCategory.name) private categoryModel:Model<FoodCategoryDocument> ) {
        super(categoryModel)
     }
}