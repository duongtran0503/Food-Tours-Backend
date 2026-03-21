import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
   hello() {
    return 'Hello from UsersService!';
   }
}