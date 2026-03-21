import { UsersService } from "@/users/users.service";
import { Controller, Get } from "@nestjs/common";

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    hello() {
        return this.usersService.hello();
    }
}