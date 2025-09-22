"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const route = (0, express_1.Router)();
route.post("/send", otp_controller_1.OtpController.otpSend);
route.post("/verify", otp_controller_1.OtpController.otpVerify);
exports.OtpRoutes = route;
