import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService
    ) {}

    async signUp(createUserDto: CreateUserDto) {
        // Check if the username already taken

        // Compare passwords

        // Sign in if passwords match

        // Create a new user
        return await this.usersService.createUser(createUserDto);
        
        // Sign in new user and return JWT token
    }
}