import AppError from "../../errorHelpers/AppError";
import {  IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Email not registered");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatusCodes.UNAUTHORIZED, "Password not match.");
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

//new access token

export const getNewAccessToken = async (refreshToken: string) => {

const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken)
  return {accessToken:newAccessToken};
};
//

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
};
