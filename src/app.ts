import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { httpResponse } from "./api/v1/helpers";
import { routeNotFound } from "./api/v1/middleware/routeNotFound";
import { errorHandler } from "./api/v1/middleware/errorHandler";
import { BASEURL, PORT } from "./api/v1/config/constants";
import { authRouter } from "./api/v1/routes/authRouter";
import { teacherRouter } from "./api/v1/routes/teacherRoutes";
import { studentRouter } from "./api/v1/routes/studentRouter";
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
dotenv.config();


// Use express app 
const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), // Change the path as needed
  { flags: 'a' } // 'a' means append to the file
);

// Define the custom token for logging user ID
morgan.token('userId', (req: express.Request) => {
  // Replace this with how you get the user ID from the request
  return (<any>req).user ? (<any>req).user.userId : 'guest';
});

// Create the Morgan middleware with the custom format and stream
const loggerMiddleware = morgan(
  ':remote-addr - :userId [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  { stream: accessLogStream }
);

// Middleware
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Routes

app.use(`${BASEURL}/auth`, authRouter); 
app.use(`${BASEURL}/teacher`, teacherRouter);
app.use(`${BASEURL}/student`, studentRouter);

// swaggerDocs(app)


/**
 * @swagger
 * /ok:
 *   get:
 *     tags:
 *       - Healthcheck
 *     summary: Health Check
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get("/ok", (_req, res) =>
  res.status(200).send(httpResponse(true, "OK", {}))
);

// Custom middleware
app.use(routeNotFound);
app.use(errorHandler);

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
