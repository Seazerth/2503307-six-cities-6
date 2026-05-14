import { IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { USER_TYPES, UserType } from '../user.constant.js';

const AVATAR_PATH_REGEXP = /^.+\.(jpg|jpeg|png)$/i;

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'email must be valid email address' })
  public email?: string;

  @IsOptional()
  @IsString({ message: 'avatarPath must be a string' })
  @Matches(AVATAR_PATH_REGEXP, { message: 'avatarPath must point to a .jpg or .png image' })
  public avatarPath?: string;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @MinLength(1, { message: 'name must be at least 1 character' })
  @MaxLength(15, { message: 'name must be at most 15 characters' })
  public name?: string;

  @IsOptional()
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @MaxLength(12, { message: 'password must be at most 12 characters' })
  public password?: string;

  @IsOptional()
  @IsIn(USER_TYPES, { message: 'userType must be one of: ordinary, pro' })
  public userType?: UserType;
}
