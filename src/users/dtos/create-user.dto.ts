import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
