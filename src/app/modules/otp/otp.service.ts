import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/emailSender";
import { generateOTP } from "../../utils/generateOTP";
import { isUserExistOrActive } from "../../utils/isUserExistOrActive";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";

const otpSend = async (email: string) => {
  const isUserExist = await isUserExistOrActive(email);

  if (isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your email already verified.");
  }

  const otp = generateOTP();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: 5 * 60,
    },
  });

  await sendEmail({
    to: email,
    subject: "Email verification OTP for PH_Tour",
    templateName: "otp",
    templateData: {
      name: isUserExist.name,
      otp: otp,
    },
  });

  return {};
};

const otpVerify = async (email: string, otp: string) => {
  const isUserExist = await isUserExistOrActive(email);

  if (isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your email already verified.");
  }

  const redisKey = `otp:${email}`;

  const savedOTP = await redisClient.get(redisKey);

  if (!savedOTP) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid OTP");
  }

  if (savedOTP !== otp) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid OTP");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }),
    redisClient.del([redisKey]),
  ]);

  return {};
};

export const OtpServices = {
  otpSend,
  otpVerify,
};
