import multer, { FileFilterCallback } from 'multer'
import path from 'path';
import { randomUUID } from 'crypto';
import { Request, RequestHandler } from 'express';
import ApiError from '../utils/ApiError';

const storage = multer.diskStorage({
  destination(req, file, callback) {
      if(file.mimetype.startsWith('image/')){
        callback(null, "./src/public/imageUpload")
      } 
      else if(file.mimetype.startsWith('video/')){
        callback(null, "./src/public/videoUpload")
      } else{
        return callback(new ApiError(422,'Invalid file type'), '');
      }
  },
  filename(req, file, callback) {
    const uniqueSuffix = randomUUID()
    const ext = path.extname(file.originalname)
    callback(null, `${file.originalname}-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (file.fieldname === "video" && file.mimetype.startsWith("video/")) {
    callback(null, true)
  } else if (file.fieldname === "thumbnail" && file.mimetype.startsWith("image/")) {
    callback(null, true)
  } else if (file.fieldname === "profilePicture" && file.mimetype.startsWith("image/")) {
    callback(null, true)
  } else if (file.fieldname === "coverPicture" && file.mimetype.startsWith("image/")) {
    callback(null, true)
  } else {
    callback(new ApiError(422, `Invalid file type for field ${file.fieldname}`))
  }
};

const upload = multer({ storage, fileFilter });

export const uploadProfileCover: RequestHandler = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverPicture', maxCount: 1 },
])

export const uploadVideoWithThumbnail: RequestHandler = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// multer() is middleware, multer uses custom disk storage and fileFilter to validate files
// RequestHandler to define middleware