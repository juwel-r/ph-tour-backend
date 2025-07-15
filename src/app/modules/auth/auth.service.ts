import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVar } from "../../config/env";

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

  const jwtPayload = {
    uid: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  // const accessToken = jwt.sign(jwtPayload, 'hello-secret', {expiresIn:'1h'});
  const accessToken = generateToken(jwtPayload, envVar.JWT_SECRET, envVar.JWT_EXPIRES)

  return { accessToken};
};
//

export const AuthServices = {
  credentialLogin,
};
