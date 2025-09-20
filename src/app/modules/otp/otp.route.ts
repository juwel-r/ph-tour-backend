import { Router } from "express";
import { OtpController } from "./otp.controller";

const route = Router();

route.post("/send", OtpController.otpSend);
route.post("/verify", OtpController.otpVerify);

export const OtpRoutes = route;
