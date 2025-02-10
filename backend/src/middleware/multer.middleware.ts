import multer from 'multer'
import path from 'path';
import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';

const storage = multer.diskStorage({
    destination(req, file, callback) {
     callback(null, './src/public/temp');
    },
    filename(req, file, callback) {
      const uniqueSuffix = randomUUID()
      const ext = path.extname(file.originalname);
      callback(null, file.originalname + '-' + uniqueSuffix + ext)
    },
});

export const upload = multer({ storage }).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverPicture', maxCount: 1 },
]) as RequestHandler

// multer() is middleware, multer uses custom disk storage