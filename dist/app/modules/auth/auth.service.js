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
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userTokens_1 = require("../../utils/userTokens");
const user_model_1 = require("../user/user.model");
const env_config_1 = require("../../config/env.config");
const isUserExistOrActive_1 = require("../../utils/isUserExistOrActive");
const jwt_1 = require("../../utils/jwt");
const emailSender_1 = require("../../utils/emailSender");
//Login ==> it commented cause of using "Passport js local"
// const credentialLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;
//   const isUserExist = await isUserExistOrActive(email!);
//   const isPasswordMatch = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );
//   if (!isPasswordMatch) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Password not match.");
//   }
//   const userTokens = createUserTokens(isUserExist);
//   const loggedUser = isUserExist.toObject(); //created a shallow copy of logged user
//   delete loggedUser.password; //removed password to send client side
//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: loggedUser,
//   };
// };
//new access token =>
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createAccessTokenWithRefreshToken)(refreshToken);
    return { accessToken: newAccessToken };
});
//Reset Password
const changePassword = (newPassword, oldPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPassMatched = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPassMatched) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password does not matched!");
    }
    const newHashedPass = yield bcryptjs_1.default.hash(newPassword, Number(env_config_1.envVar.BCRYPT_SALT_ROUND));
    user.password = newHashedPass;
    user.save();
});
const setPassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Yoy have already set your password.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_config_1.envVar.BCRYPT_SALT_ROUND));
    const credential = {
        provider: "credential",
        providerId: user.email,
    };
    const authProvider = [...user.auth, credential];
    user.auth = authProvider;
    user.password = hashedPassword;
    user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield (0, isUserExistOrActive_1.isUserExistOrActive)(email);
    const JwtPayload = {
        userId: isUserExist._id,
        role: isUserExist.role,
        email: email,
    };
    const resetToken = (0, jwt_1.generateToken)(JwtPayload, env_config_1.envVar.JWT_ACCESS_SECRET, "10m");
    const resetUILink = `${env_config_1.envVar.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, emailSender_1.sendEmail)({
        to: isUserExist.email,
        subject: "Reset password",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink,
        },
    });
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You can not reset password.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(env_config_1.envVar.BCRYPT_SALT_ROUND));
    yield user_model_1.User.findByIdAndUpdate(payload.id, { password: hashedPassword });
});
/**
http://localhost:3000/reset-password?id=68cc5e8e0886713abde467ae&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGNjNWU4ZTA4ODY3MTNhYmRlNDY3YWUiLCJyb2xlIjoiVVNFUiIsImVtYWlsIjoicmlyaXhpZDg1MEBiaXRmYW1pLmNvbSIsImlhdCI6MTc1ODIyNTQ5NCwiZXhwIjoxNzU4MjI2MDk0fQ.xk8MoXdnUP8t_cqyGOiQm3TU7av68hK1_BY6u3c3VRY
 */
exports.AuthServices = {
    // credentialLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword,
};
