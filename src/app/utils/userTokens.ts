import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatusCodes from 'http-status-codes'

export const createUserTokens =(user:Partial<IUser>)=>{
      const jwtPayload = {
    uid: user._id,
    email: user.email,
    role: user.role,
  };

  // const accessToken = jwt.sign(jwtPayload, 'hello-secret', {expiresIn:'1h'});
  const accessToken = generateToken(
    jwtPayload,
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVar.JWT_REFRESH_SECRET,
    envVar.JWT_REFRESH_EXPIRES
  );
  return{accessToken, refreshToken}
}

export const createAccessTokenWithRefreshToken =async (refreshToken:string)=>{
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVar.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      `No user exist with ${verifiedRefreshToken.email}`
    );
  }

  if (isUserExist.isActive !== IsActive.ACTIVE || isUserExist.isDelete) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "User Inactive or Blocked or Deleted."
    );
  }

  const jwtPayload = {
    uid: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES
  );

  return accessToken
}