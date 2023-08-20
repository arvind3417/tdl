import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { genAccessToken, genRefreshToken } from "../helpers/jwt";
import { hashPassword, hashCompare } from "../helpers/hashedPassword";
// import  from "../config/data/dao/user";
import { getUserByEmail, getusersbyID, createUser } from "../config/data/dao/user";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers";

export const loginController = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const { email, password } = _req.body;
    if (!email || !password)
      return _next(
        new CustomErrors.BadRequestError("Please provide email and password")
      );

    const user = await getUserByEmail(email)
    // console.log('====================================');
    // console.log(user.password);
    // console.log('====================================');
    if (!user)
      return _next(
        new CustomErrors.NotFoundError("Invalid email or user does not exist")
      );

    if (!user.password)
      return _next(
        new CustomErrors.InternalServerError(
          "User password not found in the database"
        )
      );
    if (hashCompare(password, user.password)) {
      const accessToken = genAccessToken(user);
      const refreshToken = genRefreshToken(user);
      _res.status(StatusCodes.OK).json(
        httpResponse(true, "User logged in successfully", {
          accessToken,
          refreshToken,
        })
      );
    } else {
      // passwords do not match
      return _next(new CustomErrors.UnauthorizedError("Invalid password"));
    }
  }
);

export const registerController = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
      if (
        !_req.body.username ||
        !_req.body.email ||
        !_req.body.password ||
        !_req.body.role
      )
        return _next(
          new CustomErrors.BadRequestError("Please provide all required fields")
        );
  
      let user = await getUserByEmail(_req.body.email);
  
      if (!user) {
        try {
          user = await createUser(_req.body.username, _req.body.email, _req.body.password, _req.body.role);
          
          const accessToken = genAccessToken(user);
          const refreshToken = genRefreshToken(user);
          
          _res.status(StatusCodes.CREATED).json(
            httpResponse(true, "User created successfully", {
              accessToken,
              refreshToken,
            })
          );
        } catch (err: any) {
          return _next(
            new CustomErrors.BadRequestError("Invalid user data " + err.message)
          );
        }
      } else {
        return _next(new CustomErrors.BadRequestError("User already exists"));
      }
    }
  );
  