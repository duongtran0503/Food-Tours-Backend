import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from "@/common/repositories/base-repository";
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Food, FoodDocument } from '@/schemas/foods.chema';

@Injectable()
export class FoodRepository extends BaseRepository<FoodDocument> {
     constructor(@InjectModel(Food.name) private FoodModel:Model<FoodDocument> ) {
        super(FoodModel)
     }
}