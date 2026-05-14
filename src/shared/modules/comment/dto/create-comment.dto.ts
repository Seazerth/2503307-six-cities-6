import { Type } from 'class-transformer';
import { IsDate, IsInt, IsMongoId, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'text must be a string' })
  @Length(5, 1024, { message: 'text length must be between 5 and 1024 characters' })
  public text!: string;

  @Type(() => Number)
  @IsInt({ message: 'rating must be an integer value' })
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  public rating!: number;

  @IsMongoId({ message: 'offerId must be a valid MongoDB identifier' })
  public offerId!: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'postDate must be a valid date' })
  public postDate?: Date;

  @IsOptional()
  @IsMongoId({ message: 'userId must be a valid MongoDB identifier' })
  public userId?: string;
}
