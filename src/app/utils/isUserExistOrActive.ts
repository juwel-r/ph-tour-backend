import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const isUserExistOrActive = async (email: string) => {
  const isUserExist = await User.findOne({ email: email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, `No user exist with ${email}`);
  }

  if (isUserExist.isActive !== IsActive.ACTIVE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This user is ${isUserExist.isActive}`
    );
  }

  if (isUserExist.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is Deleted.");
  }

  return isUserExist;
};
