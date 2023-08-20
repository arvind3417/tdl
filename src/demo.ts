// import express from 'express';
// import multer from 'multer';
// import AWS from 'aws-sdk';
// import multerS3 from 'multer-s3';
// import knex  from '../src/api/v1/config/data/db'; // Initialize your database connection

import { PORT } from "./api/v1/config/constants";

// const app = express();
// const port = 3000;

// // Initialize AWS and S3 instance
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// // Configure multer
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'toddle-s3',
//     key: (_req, file, cb) => {
//       cb(null, 'uploads/' + Date.now() + '_' + file.originalname);
//     },
//   }),
// });

// // Route for file upload
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const { description } = req.body;

//     // Store file information in the database
//     await knex('journals').insert({
//       description: description,
//       attachment_type: 'pdf',
//       attachment_url: (req.file as any).location,
//     });

//     res.status(200).send('File uploaded successfully.');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { uploadMiddleware } from "./api/v1/middleware/imageuplad";
dotenv.config();

const app = express();
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
AWS.config.update(
    {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,


    }
);
const s3 = new AWS.S3();
const bucket = process.env.BUCKET_NAME;
var upload = multer({
    storage:multerS3({
        s3:s3,
        bucket:bucket,
        // acl:"public-read",
        contentType:multerS3.AUTO_CONTENT_TYPE,
        key:function (req,file,cb) {
            cb(null,file.originalname);
            
        }
    })
});

app.get("/",(req,res,next)=>{
    res.send("ok")
})
// const upload = multer({storage:storage})

app.post('/upload',uploadMiddleware,(req,res)=>{
    console.log('====================================');
    console.log(req.file);
    console.log('====================================');
    res.send("success uploaddd");
})

const port = process.env.PORT || PORT;

try {
  // connect to database
//   if (!process.env.CONNECTIONSTR)
//     throw new Error("No connection string found in .env file");
//   connectDB(process.env.CONNECTIONSTR);
  // Server setup
  app.listen(port, () => {
    console.log(`Server listening on: http://localhost:${port}/`); 
    
  });
} catch (error) {
  console.error(error);
}