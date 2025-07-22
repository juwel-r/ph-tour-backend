/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import {
  createAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { isUserExistOrActive } from "../../utils/isUserExistOrActive";
import { User } from "../user/user.model";
import { envVar } from "../../config/env";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await isUserExistOrActive(email!);

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password not match.");
  }

  const userTokens = createUserTokens(isUserExist);

  const loggedUser = isUserExist.toObject(); //created a shallow copy of logged user
  delete loggedUser.password; //removed password to send client side

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: loggedUser,
  };
};

//new access token =>
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken);
  return { accessToken: newAccessToken };
};

//Reset Password
const resetPassword = async (  newPassword: string,  oldPassword: string,  decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPassMatched = await bcryptjs.compare(oldPassword, user!.password!);

  if (!isOldPassMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Old Password does not matched!"
    );
  }

  const newHashedPass = await bcryptjs.hash(
    newPassword,
    Number(envVar.BCRYPT_SALT_ROUND)
  );

  user!.password = newHashedPass;
  user!.save();
};

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
