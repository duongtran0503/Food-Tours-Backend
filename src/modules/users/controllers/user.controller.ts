import { UserService } from "@/modules/users/services/user.service";
import { Controller, Get } from "@nestjs/common";

@Controller('users')
export class UserController {

    constructor(private readonly usersService: UserService) {}

    @Get()
    hello() {
        return ""
    }
}