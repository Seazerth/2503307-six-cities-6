import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base.controller.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import asyncHandler from 'express-async-handler';
import { DEFAULT_AVATAR_PATH } from '../user/user.constant.js';
import { OfferService } from '../offer/offer-service.interface.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
  }

  private serializeUser(user: unknown) {
    if (!user || typeof user !== 'object') {
      return user;
    }

    const source = user as Record<string, unknown>;
    const avatarPath = !source.avatarPath || source.avatarPath === 'default-avatar.png'
      ? DEFAULT_AVATAR_PATH
      : source.avatarPath;

    return {
      id: String(source.id ?? source._id ?? ''),
      email: source.email,
      name: source.name,
      avatarPath,
      userType: source.userType,
    };
  }

  private serializeComment(comment: Record<string, unknown>) {
    return {
      id: String(comment.id ?? comment._id ?? ''),
      text: comment.text,
      postDate: comment.postDate,
      rating: comment.rating,
      offerId: typeof comment.offerId === 'object' ? (comment.offerId as Record<string, unknown>).id ?? (comment.offerId as Record<string, unknown>)._id : comment.offerId,
      author: this.serializeUser(comment.userId),
    };
  }

  // Создание комментария (POST /api/comments)
  public create = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user;
    const offerId = (req.body as CreateCommentDto).offerId;

    if (!(await this.offerService.exists(offerId))) {
      this.notFound(res, `Offer with id ${offerId} not found`);
      return;
    }

    const createCommentDto: CreateCommentDto = {
      text: (req.body as CreateCommentDto).text,
      rating: (req.body as CreateCommentDto).rating,
      offerId,
      userId: user.id,
    };
    const newComment = await this.commentService.create(createCommentDto);
    this.created(res, this.serializeComment(newComment.toObject() as Record<string, unknown>));
  });

  // Получение комментариев для предложения (GET /api/offers/:offerId/comments)
  public index = asyncHandler(async (req: Request, res: Response) => {
    const { offerId } = req.params;
    const comments = await this.commentService.findByOfferId(offerId as string);
    this.ok(res, comments.map((comment) => this.serializeComment(comment.toObject() as Record<string, unknown>)));
  });
}
