import { UserSchema } from "@/schemas/user.schema";
import { UserController } from "@/modules/users/controllers/user.controller";
import { UserService } from "@/modules/users/services/user.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { StaffController } from "@/modules/users/controllers/staff.controller";
import { StaffService } from "@/modules/users/services/staff.service";

@Module({
    imports:[MongooseModule.forFeature([
        {
            name: 'User',
            schema: UserSchema
        }
    ])],
controllers:[UserController,StaffController],
providers: [UserService,UserRepository,StaffService],
exports:[UserRepository]
})
export class UsersModule {};