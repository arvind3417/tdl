import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3();
const bucket = process.env.BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3,
    bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key:function (req,file,cb) {
        cb(null,file.originalname);
        
    }
  }),
});

export const uploadMiddleware = upload.single('file');
