import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import { generateToken, verifyToken } from "./jwt";
import { isUserExistOrActive } from "./isUserExistOrActive";
import { IUser } from "../modules/user/user.interface";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload: JwtPayload = {
    userId: user._id,
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
  return { accessToken, refreshToken };
};

export const createAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVar.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await isUserExistOrActive(verifiedRefreshToken.email);

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
