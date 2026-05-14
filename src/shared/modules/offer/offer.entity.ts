import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { OfferType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { OFFER_CITIES, OFFER_GOODS } from './offer.constant.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

class Location {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, minlength: 10, maxlength: 100 })
  public title!: string;

  @prop({ trim: true, required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({ required: true, enum: OFFER_CITIES })
  public city!: string;

  @prop({ required: true })
  public previewImage!: string;

  @prop({
    type: () => String,
    required: true,
    validate: {
      validator: (v: string[]) => v.length === 6,
      message: 'Exactly 6 images are required'
    }
  })
  public images!: string[];

  @prop({ default: false })
  public isPremium!: boolean;

  @prop({
    required: true,
    min: 1,
    max: 5,
    default: 1,
    validate: {
      validator: (value: number) => Number.isInteger(value * 10),
      message: 'Rating must contain at most one digit after the decimal point'
    }
  })
  public rating!: number;

  @prop({
    type: () => String,
    enum: OfferType,
    required: true
  })
  public type!: OfferType;

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({
    type: () => String,
    enum: OFFER_GOODS,
    required: true,
    validate: {
      validator: (values: string[]) => values.length >= 1,
      message: 'At least one good is required'
    }
  })
  public goods!: string[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public authorId!: Ref<UserEntity>;

  @prop({ default: 0, min: 0 })
  public commentCount!: number;

  @prop({
    _id: false,
    type: () => Location,
    required: true
  })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
