import AppError from "../../errorHelpers/AppError";
import { AuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatusCodes from "http-status-codes";
import bctyptjs from "bcryptjs";
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  // // ==> This is keep off for try global error handle
  // const isEmailExist = await User.findOne({ email });
  // if (isEmailExist) {
  //   throw new AppError(httpStatusCodes.BAD_REQUEST, "Email already registered");
  // }

  const auth: AuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const hashedPassword = await bctyptjs.hash(
    password as string,
    Number(envVar.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
    auth,
  });

  return user;
};

// Get All Users
const getAllUsers = async () => {
  const users = await User.find({}).select("-password");

  const totalUsers = await User.countDocuments();
  return { data: users, meta: { total: totalUsers } };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");

  return user;
};

const getMe = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return user;
};

//Update User
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(
      httpStatusCodes.NOT_FOUND,
      "User not found to be update."
    );
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUID) {
      throw new AppError(
        httpStatusCodes.FORBIDDEN,
        "You are not permitted to update Role"
      );
    }

    if (
      payload.role === Role.SUPER_ADMIN &&
      decodedToken.role !== Role.SUPER_ADMIN
    ) {
      throw new AppError(
        httpStatusCodes.FORBIDDEN,
        "You are not permitted to update Role to 'SUPER ADMIN'"
      );
    }
  }

  if (
    (payload.isActive || payload.isDelete || payload.isVerified) &&
    (decodedToken.role === Role.USER || decodedToken.role === Role.GUID)
  ) {
    throw new AppError(
      httpStatusCodes.FORBIDDEN,
      "You are not permitted to update."
    );
  }

  if (payload.password) {
    payload.password = await bctyptjs.hash(
      payload.password,
      Number(envVar.BCRYPT_SALT_ROUND)
    );
  }

  const updateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updateUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
};
