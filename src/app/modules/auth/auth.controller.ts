/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { AuthServices } from "./auth.service";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialLogin(req.body);

    // res.json({
    //     success: true,
    //   statusCode: 200,
    //   message: "User Logged In successful",
    //   data: loginInfo,}
    // );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User Logged In successful",
      data: loginInfo,
    });
  }
);

export const AuthController = {
  credentialLogin,
};
