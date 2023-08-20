import express from "express";


import {
  deleteJournal,
  getJournal,
  handleJournalCreation, handleJournalUpdate, 
  
} from "../controllers/teacherController";
import { authenticateToken } from "../middleware/authToken";
import { adminMiddleware } from "../middleware/isAdmin";
import { Roles } from "../config/constants";
import { uploadMiddleware } from "../middleware/imageuplad";

export const teacherRouter = express.Router();

teacherRouter.route("/journal").post(authenticateToken,adminMiddleware([Roles.TEACHER]),uploadMiddleware,handleJournalCreation);
teacherRouter.route("/journal/:id").patch(authenticateToken,adminMiddleware([Roles.TEACHER]),uploadMiddleware,handleJournalUpdate).delete(authenticateToken,adminMiddleware([Roles.TEACHER]),deleteJournal);
teacherRouter.route("/journal/:teacherid").get(authenticateToken,adminMiddleware([Roles.TEACHER]),getJournal)
