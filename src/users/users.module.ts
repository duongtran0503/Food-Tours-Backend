import { UserSchema } from "@/schemas/user.schema";
import { UsersController } from "@/users/users.controller";
import { UsersService } from "@/users/users.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports:[MongooseModule.forFeature([
        {
            name: 'User',
            schema: UserSchema
        }
    ])],
controllers:[UsersController],
providers: [UsersService],
})
export class UsersModule {};