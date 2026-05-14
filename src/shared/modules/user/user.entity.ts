import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { DEFAULT_AVATAR_PATH, USER_TYPES, UserType } from './user.constant.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    unique: true,
    required: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
  })
  public email: string;

  @prop({ required: false, default: DEFAULT_AVATAR_PATH, match: /^.+\.(jpg|jpeg|png)$/iu })
  public avatarPath: string;

  @prop({ required: true, minlength: 1, maxlength: 15 })
  public name: string;

  @prop({ required: true, minlength: 6, maxlength: 64, select: false })
  public password?: string;

  @prop({ required: true, enum: USER_TYPES })
  public userType!: UserType;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.name = userData.name;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public comparePassword(password: string, salt: string): boolean {
    return this.password === createSHA256(password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
