import { Request, Response, NextFunction } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import knex from "knex"; // Assuming you are using knex for database queries
import { v4 as uuidv4 } from "uuid";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { createJournal, getJournals, removeJournals,allJournals,updateeJournal,getStudentJournalsByUsername, getteacherJournals } from "../config/data/dao/journal";
import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";
// import { AttachmentType } from "../config/constants";
import { STATUS_CODES } from "http";
import { StatusCodes } from "http-status-codes";
import { httpResponse } from "../helpers";

const s3 = new aws.S3({
  apiVersion: "latest",
  region: "us-east-1",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "your-s3-bucket-name",
    acl: "public-read", // Make the uploaded files public
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueFileName = uuidv4() + "-" + file.originalname;
      cb(null, uniqueFileName);
    },
  }),
});

export interface IMulterRequestFile {
    key: string
    path: string
    mimetype: string
    originalname: string
    size: number
    location: string
  }
export async function handleJournalCreation(
    req: Request ,
    res: Response,
    next: NextFunction
  ) {
    try {
      enum AttachmentType {
        URL = 'url',
        IMAGE = 'image',
        VIDEO = 'video',
        AUDIO = 'audio',
      }
      
        
        function getFileExtension(fileName: string): string {
          const parts = fileName.split('.');
          if (parts.length > 1) {
            return parts[parts.length - 1].toLowerCase();
          }
          return '';
        }
        
        

        const uploadedFile = req.file;
        

if (!uploadedFile) {
  return res.status(400).json({
    success: false,
    message: "File upload is required",
  });
}

const typedUploadedFile = uploadedFile as unknown as IMulterRequestFile;
// Determine the attachment type based on the uploaded file's extension
const extension = getFileExtension(typedUploadedFile.originalname);
const allowedExtensions = ['pdf', 'mp4', 'avi', 'mov', 'jpg', 'jpeg', 'png', 'gif'];
if (!allowedExtensions.includes(extension)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid file type. Allowed types: pdf, video, image',
  });
}
// console.log(extension);

// const attachmentType1 = getAttachmentType(extension);


  
  
        const { description, tagged_students } = req.body;
  
        // Determine the attachment type based on the uploaded file's MIME type
        const attachmentType = uploadedFile.mimetype.startsWith("image")
          ? "image"
          : uploadedFile.mimetype.startsWith("video")
          ? "video"
          : "other"; // Adjust this based on your requirements
  
        // Construct the entry for the 'journals' table
        const journalEntry = {
          teacher_id: (<any>req).user.userId,

        //   seller_id: sellerId,
          description,
          tagged_students,
          published_at : new Date(),
          attachment_type: extension,
          attachment_url: typedUploadedFile.location, // Use the URL of the uploaded file
        };
  
        const createdJournal =  await createJournal(journalEntry);
        console.log(createdJournal);
        
        res.status(StatusCodes.CREATED).json(
          httpResponse(true, "Journal Created successfully", {
            createdJournal
          })
        );
      
    } catch (error: any) {
      console.error("Error:", error);
      return next(new CustomErrors.InternalServerError(error.message));
    }
  }
  

  export async function handleJournalUpdate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uploadedFile = req.file;

      if (!uploadedFile) {
        return res.status(400).json({
          success: false,
          message: "File upload is required",
        });
      }
      function getFileExtension(fileName: string): string {
        const parts = fileName.split('.');
        if (parts.length > 1) {
          return parts[parts.length - 1].toLowerCase();
        }
        return '';
      }
      const journalId = req.params.id; // Assuming you can get the journal ID from the URL
const typedUploadedFile = uploadedFile as unknown as IMulterRequestFile;
const extension = getFileExtension(typedUploadedFile.originalname);
const allowedExtensions = ['pdf', 'mp4', 'avi', 'mov', 'jpg', 'jpeg', 'png', 'gif'];
if (!allowedExtensions.includes(extension)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid file type. Allowed types: pdf, video, image',
  });
}
  
      const { description, tagged_students } = req.body;
      const attachmentType = uploadedFile.mimetype.startsWith("image")
      ? "image"
      : uploadedFile.mimetype.startsWith("video")
      ? "video"
      : "other";
  
      // Construct the updated entry for the 'journals' table
      const updatedJournal = {
        description,
        tagged_students,
        attachment_type: extension,
        attachment_url: typedUploadedFile.location,

        // published_at: new Date(published_at),
      };
  
      // Assuming you have an 'updateJournal' function that updates the journal in the database
      const updatedEntry =  updateeJournal(journalId, updatedJournal);
  // _res.status(StatusCodes.OK).json(
  //   httpResponse(true, "User logged in successfully", {
  //     accessToken,
  //     refreshToken,
  //   })
  // );
      return res.status(StatusCodes.OK).json(
        httpResponse(true,"Journal Updated Succesfully",{
          updatedEntry
        })
      );
    } catch (error: any) {
      console.error("Error:", error);
      return next(new CustomErrors.InternalServerError(error.message));
    }
  }
  
  export const deleteJournal = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
        try {
            const { id } = _req.params;
            const res = removeJournals(id);

            // const catalog = await Catalog.findOne({ sellerId }).populate('products');
            // _res.json(res);
            _res
            .status(StatusCodes.NO_CONTENT)
            .json(
              httpResponse(
                true,
                `Journal deleted successfully`,
                res
              )
            );
          } catch (error:any) {
            return _next(new CustomErrors.InternalServerError(error.message));

          }
    }
  );

  export const getJournal = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
        try {
            const id  = (<any>_req).user.userId;
            const res= await getteacherJournals(id)
            // console.log(r);
            
            // const catalog = await Catalog.findOne({ sellerId }).populate('products');
            // _res.json(res);
            _res
            .status(StatusCodes.OK)
            .json(
              httpResponse(
                true,
                `Journals retrieved successfully`,
               res
              )
            );
          } catch (error:any) {
            return _next(new CustomErrors.InternalServerError(error.message));

          }
    }
  );

function next(arg0: CustomErrors.InternalServerError) {
    throw new Error("Function not implemented.");
}
