import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";

@Controller('api/auth')
export class AuthController {
    constructor (
        private readonly authService: AuthService
    ) {}

    @HttpCode(201)
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('sign-up')
    async signUp(@Body() createUserDto: CreateUserDto) {
        return await this.authService.signUp(createUserDto);
    }
}