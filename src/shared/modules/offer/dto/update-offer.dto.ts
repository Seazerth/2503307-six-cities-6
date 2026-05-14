import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDate, IsEnum, IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString, Length, Max, Min, ValidateNested } from 'class-validator';
import { OfferType } from '../../../types/index.js';
import { OFFER_CITIES, OFFER_GOODS, OfferCity, OfferGood } from '../offer.constant.js';

class OfferLocationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 6 })
  public latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 6 })
  public longitude?: number;
}

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  @Length(10, 100)
  public title?: string;

  @IsOptional()
  @IsString()
  @Length(20, 1024)
  public description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public postDate?: Date;

  @IsOptional()
  @IsIn(OFFER_CITIES, { message: 'city must be one of the supported cities' })
  public city?: OfferCity;

  @IsOptional()
  @IsString()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  public images?: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  public isFavorite?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating?: number;

  @IsOptional()
  @IsEnum(OfferType)
  public type?: OfferType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(8)
  public rooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  public guests?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(100000)
  public price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsIn(OFFER_GOODS, { each: true, message: 'goods contain unsupported values' })
  public goods?: OfferGood[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OfferLocationDto)
  public location?: OfferLocationDto;
}
