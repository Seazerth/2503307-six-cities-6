import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDate, IsEnum, IsIn, IsInt, IsMongoId, IsNumber, IsObject, IsOptional, IsString, Length, Max, Min, ValidateNested } from 'class-validator';
import { OfferType } from '../../../types/index.js';
import { OFFER_CITIES, OFFER_GOODS, OfferCity, OfferGood } from '../offer.constant.js';

class OfferLocationDto {
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 6 })
  public latitude!: number;

  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 6 })
  public longitude!: number;
}

export class CreateOfferDto {
  @IsString()
  @Length(10, 100)
  public title!: string;

  @IsString()
  @Length(20, 1024)
  public description!: string;

  @Type(() => Date)
  @IsDate()
  public postDate!: Date;

  @IsIn(OFFER_CITIES, { message: 'city must be one of the supported cities' })
  public city!: OfferCity;

  @IsString()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  public images!: string[];

  @Type(() => Boolean)
  @IsBoolean()
  public isPremium!: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  public isFavorite!: boolean;

  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating!: number;

  @IsEnum(OfferType)
  public type!: OfferType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(8)
  public rooms!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  public guests!: number;

  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(100000)
  public price!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsIn(OFFER_GOODS, { each: true, message: 'goods contain unsupported values' })
  public goods!: OfferGood[];

  @IsOptional()
  @IsMongoId()
  public authorId?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => OfferLocationDto)
  public location!: OfferLocationDto;
}
