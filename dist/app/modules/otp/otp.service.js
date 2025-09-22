"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpServices = void 0;
const redis_config_1 = require("../../config/redis.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const emailSender_1 = require("../../utils/emailSender");
const generateOTP_1 = require("../../utils/generateOTP");
const isUserExistOrActive_1 = require("../../utils/isUserExistOrActive");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const otpSend = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield (0, isUserExistOrActive_1.isUserExistOrActive)(email);
    if (isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your email already verified.");
    }
    const otp = (0, generateOTP_1.generateOTP)();
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: 5 * 60,
        },
    });
    yield (0, emailSender_1.sendEmail)({
        to: email,
        subject: "Email verification OTP for PH_Tour",
        templateName: "otp",
        templateData: {
            name: isUserExist.name,
            otp: otp,
        },
    });
    return {};
});
const otpVerify = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield (0, isUserExistOrActive_1.isUserExistOrActive)(email);
    if (isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your email already verified.");
    }
    const redisKey = `otp:${email}`;
    const savedOTP = yield redis_config_1.redisClient.get(redisKey);
    if (!savedOTP) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid OTP");
    }
    if (savedOTP !== otp) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid OTP");
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }),
        redis_config_1.redisClient.del([redisKey]),
    ]);
    return {};
});
exports.OtpServices = {
    otpSend,
    otpVerify,
};
