/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setCookieAuth } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

//New access token with refreshToken =>
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

//Logout =>
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Successfully Logged out",
      data: null,
    });
  }
);

//Reset Password =>
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, oldPassword } = req.body;
    const decodedToken = req.user;
    const updatePassword = await AuthServices.resetPassword(
      newPassword,
      oldPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Password changed successfully.",
      data: null,
    });
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const redirectTo = req.query.state //state is passed in route 

    if (!user) {
      throw new AppError(httpStatusCodes.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserTokens(user);

    setCookieAuth(res, tokenInfo);

    res.redirect(envVar.FRONTEND_URL+redirectTo);
  }
);

export const AuthController = {
  credentialLogin,
  getNewAccessToken, 
  logout,
  resetPassword,
  googleCallback,
};
