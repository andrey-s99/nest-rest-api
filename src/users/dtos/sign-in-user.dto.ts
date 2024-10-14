import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsNumber()
  id: number;
}
