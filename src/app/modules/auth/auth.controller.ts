/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setCookieAuth } from "../../utils/setCookie";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialLogin(req.body);

    setCookieAuth(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "User Logged In successful",
      data: loginInfo,
    });
  }
);

//New access token with refreshToken
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatusCodes.BAD_REQUEST,
        "No refresh token received."
      );
    } 
    // const refreshToken = req.headers.authorization
    const accessTokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    setCookieAuth(res, accessTokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "New access token generate successful",
      data: accessTokenInfo,
    });
  }
);

export const AuthController = {
  credentialLogin,
  getNewAccessToken,
};
