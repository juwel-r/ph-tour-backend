/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OtpServices } from "./otp.service";

const otpSend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await OtpServices.otpSend(email);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "OTP sent successfully.",
      data: null,
    });
  }
);

const otpVerify = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    await OtpServices.otpVerify(email, otp);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "OTP verified successfully",
      data: null,
    });
  }
);

export const OtpController = {
  otpSend,
  otpVerify,
};
