/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { envVar } from "../../config/env";
import { AuthProvider } from "../user/user.interface";

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
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken);
  return { accessToken: newAccessToken };
};

//Reset Password
const resetPassword = async (
  newPassword: string,
  oldPassword: string,
  decodedToken: JwtPayload
) => {
  return {};
};

const changePassword = async (
  newPassword: string,
  oldPassword: string,
  decodedToken: JwtPayload
) => {
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

const setPassword = async (userId: string, password: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Yoy have already set your password."
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVar.BCRYPT_SALT_ROUND)
  );
  const credential: AuthProvider = {
    provider: "credential",
    providerId: user.email,
  };
  const authProvider: AuthProvider[] = [...user.auth, credential];

  user.auth = authProvider;
  user.password = hashedPassword;
  user.save();
};

export const AuthServices = {
  // credentialLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
};
