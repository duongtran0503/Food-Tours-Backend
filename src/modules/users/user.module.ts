import { UserSchema } from "@/schemas/user.schema";
import { UserController } from "@/modules/users/controllers/user.controller";
import { UserService } from "@/modules/users/services/user.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "@/modules/users/repositories/user.repository";

@Module({
    imports:[MongooseModule.forFeature([
        {
            name: 'User',
            schema: UserSchema
        }
    ])],
controllers:[UserController],
providers: [UserService,UserRepository],
exports:[UserRepository]
})
export class UsersModule {};