import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  fullname: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
