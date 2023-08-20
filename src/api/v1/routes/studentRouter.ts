import express from "express";


import {

  getJournal,

 
} from "../controllers/studentController";
import { authenticateToken } from "../middleware/authToken";
import { adminMiddleware } from "../middleware/isAdmin";
import { Roles } from "../config/constants";

export const studentRouter = express.Router();

studentRouter.route("/journal").get(authenticateToken,adminMiddleware([Roles.STUDENT]),getJournal)
