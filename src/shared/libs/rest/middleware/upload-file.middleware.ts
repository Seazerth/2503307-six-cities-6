import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import multer from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import { mkdirSync } from 'node:fs';

export class UploadFileMiddleware implements Middleware {
  constructor(private readonly uploadDirectory: string) {}

  public execute(req: Request, res: Response, next: NextFunction): void {
    mkdirSync(this.uploadDirectory, { recursive: true });

    const storage = multer.diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      },
    });

    const upload = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          callback(new Error('Only .jpg and .png avatar files are allowed'));
          return;
        }

        callback(null, true);
      }
    });
    upload.single('avatar')(req, res, next);
  }
}
