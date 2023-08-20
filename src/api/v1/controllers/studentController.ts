import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as CustomErrors from "../errors";
import { httpResponse } from "../helpers";
import asyncWrapper from "../helpers/asyncWrapper";
import { getStudentJournalsByUsername } from "../config/data/dao/journal";


export const getJournal = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
        try {
            // const { sellerId } = _req.params;
           const res =await  getStudentJournalsByUsername((<any>_req).user.userId)
           if(res)
           _res.status(StatusCodes.OK).json(
            httpResponse(true, "Student Journals Retrived succesfulls", {
              res
            })
          );
          else {
            return _next(new CustomErrors.InternalServerError("server might get timed out"));
          }

          
          } catch (error:any) {
            return _next(new CustomErrors.InternalServerError(error.message));

          }
    }
  );