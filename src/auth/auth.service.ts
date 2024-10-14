import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInUserDto } from 'src/users/dtos/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    // Check if the user exists
    const user = await this.usersService.getUser(createUserDto.username);
    // Compare passwords
    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        createUserDto.password,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new ConflictException('Username is taken.');
      } else {
        // Sign in if passwords match
        const signInUserDto = new SignInUserDto();
        signInUserDto.username = user?.username;
        signInUserDto.id = user?.id;

        return await this.signIn(signInUserDto);
      }
    }

    // Create a new user
    const newUser = await this.usersService.createUser(createUserDto);

    // Sign in new user
    const signInUserDto = new SignInUserDto();
    signInUserDto.username = newUser.username;
    signInUserDto.id = newUser.id;

    return await this.signIn(signInUserDto);
  }

  async signIn(
    signInUserDto: SignInUserDto,
  ): Promise<{ access_token: string }> {
    const payload = {
      username: signInUserDto.username,
      id: signInUserDto.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
