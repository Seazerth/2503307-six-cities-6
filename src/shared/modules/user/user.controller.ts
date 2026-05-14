import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base.controller.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { AuthService } from '../auth/auth.service.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from '../auth/dto/login.dto.js';
import asyncHandler from 'express-async-handler';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DEFAULT_AVATAR_PATH, UserType } from './user.constant.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);
  }

  private serializeUser(user: {
    id: string;
    email: string;
    name: string;
    avatarPath: string;
    userType: UserType;
  }) {
    const avatarPath = !user.avatarPath || user.avatarPath === 'default-avatar.png'
      ? DEFAULT_AVATAR_PATH
      : user.avatarPath;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarPath,
      userType: user.userType,
    };
  }

  public getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    const user = await this.userService.findByEmail(email as string);

    if (!user) {
      this.notFound(res, `User with email ${email} not found`);
      return;
    }

    this.ok(res, user);
  });

  public createUser = asyncHandler(async (req: Request, res: Response) => {
    // Only anonymous users can create new accounts (5.8.3)
    if (res.locals.user) {
      this.forbidden(res, 'Only anonymous users can create new accounts');
      return;
    }

    const { email, password, name, avatarPath } = req.body;

    // Check if email already exists (5.8.4)
    const existingUser = await this.userService.findByEmail(email as string);
    if (existingUser) {
      this.conflict(res, `User with email ${email} already exists`);
      return;
    }

    const salt = this.config.get('SALT');

    const createUserDto: CreateUserDto = {
      email: email as string,
      password: password as string,
      name: name as string,
      avatarPath: (avatarPath as string) || DEFAULT_AVATAR_PATH,
      userType: req.body.userType as UserType,
    };

    const newUser = await this.userService.create(createUserDto, salt);
    this.created(res, this.serializeUser(newUser));
  });

  public uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    const avatarFilename = req.file?.filename;

    if (!avatarFilename) {
      this.badRequest(res, 'Avatar file is required');
      return;
    }

    const avatarPath = `/upload/${avatarFilename}`;
    const user = res.locals.user;
    const updatedUser = await this.userService.updateById(user.id, { avatarPath });
    this.ok(res, this.serializeUser(updatedUser!));
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const loginDto: LoginDto = req.body;
    const user = await this.authService.login(loginDto.email, loginDto.password);

    if (!user) {
      this.unauthorized(res, 'Invalid email or password');
      return;
    }

    const token = await this.authService.authenticate(user);
    this.ok(res, { token, user: this.serializeUser(user) });
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      await this.authService.logout(token);
    }

    this.noContent(res);
  });

  public getCurrentUser = asyncHandler(async (_req: Request, res: Response) => {
    const user = res.locals.user;
    this.ok(res, this.serializeUser(user));
  });

  public updateCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user;
    const updateUserDto = req.body as UpdateUserDto;

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userService.findByEmail(updateUserDto.email);

      if (existingUser && existingUser.id !== user.id) {
        this.conflict(res, `User with email ${updateUserDto.email} already exists`);
        return;
      }
    }

    const payload: UpdateUserDto = {
      avatarPath: updateUserDto.avatarPath,
      name: updateUserDto.name,
      email: updateUserDto.email,
      userType: updateUserDto.userType ?? user.userType,
    };

    if (updateUserDto.password) {
      user.setPassword(updateUserDto.password, this.config.get('SALT'));
      payload.password = user.getPassword();
    }

    const updatedUser = await this.userService.updateById(user.id, payload);

    if (!updatedUser) {
      this.notFound(res, `User with id ${user.id} not found`);
      return;
    }

    const token = await this.authService.authenticate(updatedUser);
    this.ok(res, { token, user: this.serializeUser(updatedUser) });
  });
}
