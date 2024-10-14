import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { SignInUserDto } from 'src/users/dtos/sign-in-user.dto';
import { User } from 'src/decorators/user.decorator';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @HttpCode(201)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@User() user: AuthenticatedUser) {
    const signInUserDto = new SignInUserDto();
    signInUserDto.username = user.username;
    signInUserDto.id = user.id;

    return await this.authService.signIn(signInUserDto);
  }
}
