/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setCookieAuth } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { envVar } from "../../config/env.config";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { IUser } from "../user/user.interface";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // // === >> this is manual login system by using "AuthServices.credentialLogin"
    // const loginInfo = await AuthServices.credentialLogin(req.body);

    //Try passport js local login system
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        //❌❌❌
        // return new AppError(401, err);
        //next(err)
        //throw new AppError(401, err)

        //✅✅✅ -> must user "return" and "next"
        // return next(err);
        return next(new AppError(401, err));
      }

      // // No need to use this part, cause if user not found then passport will pass an error in done() and that error will caught if error true
      // if (!user) {
      //   return new AppError(401, err);
      // }

      const userTokens = createUserTokens(user);

      delete user.toObject().password;
      setCookieAuth(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatusCodes.OK,
        message: "User Logged In successful",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user,
        },
      });
    })(req, res, next);
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
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Password reset successfully.",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, oldPassword } = req.body;
    const decodedToken = req.user;
    const updatePassword = await AuthServices.changePassword(
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

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const decodedToken = req.user as JwtPayload;
    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Password set successfully.",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthServices.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Password recovery email sent successfully.",
      data: null,
    });
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const redirectTo = req.query.state; //state is passed in route

    if (!user) {
      throw new AppError(httpStatusCodes.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserTokens(user);

    setCookieAuth(res, tokenInfo);

    res.redirect(envVar.FRONTEND_URL + redirectTo);
  }
);

export const AuthController = {
  credentialLogin,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
  googleCallback,
};
