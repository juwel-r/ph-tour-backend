import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/emailSender";
import { generateOTP } from "../../utils/generateOTP";
import { isUserExistOrActive } from "../../utils/isUserExistOrActive";

const otpSend = async (email: string) => {
  const isExist = await isUserExistOrActive(email);
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
      name: isExist.name,
      otp: otp,
    },
  });

  return {};
};

const otpVerify = async () => {};

export const OtpServices = {
  otpSend,
  otpVerify,
};
