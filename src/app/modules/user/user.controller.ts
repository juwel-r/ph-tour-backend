/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { OtpServices } from "../otp/otp.service";

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

    // await OtpServices.otpSend(user.email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Registration successful, please verify email.",
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

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My data retrieved successfully.",
      data: result,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserService.getSingleUser(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single user retrieved successfully.",
      data: result,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization as string;
    // const verifiedToken = verifyToken(token, envVar.JWT_ACCESS_SECRET) as JwtPayload;
    const verifiedToken = req.user;
    const payload = req.body;

    const updateUser = await UserService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
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
  getSingleUser,
  getMe,
  updateUser,
};
