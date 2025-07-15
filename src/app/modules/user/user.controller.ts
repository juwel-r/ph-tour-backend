/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await UserService.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully.",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully.",
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization as string;
    // const verifiedToken = verifyToken(token, envVar.JWT_SECRET) as JwtPayload;
    const verifiedToken = req.user;
    const payload = req.body;

    const updateUser = await UserService.updateUser(
      userId,
      payload,
      verifiedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users updated successfully.",
      data: updateUser,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser
};
