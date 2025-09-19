import { v2 as cloudinary } from "cloudinary";
import { envVar } from "./env.config";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVar.CLOUDINARY_CLOUD_NAME,
  api_secret: envVar.CLOUDINARY_API_SECRET,
  api_key: envVar.CLOUDINARY_API_KEY,
});

export const cloudinaryDelete = async (url: string) => {
  try {
    // eslint-disable-next-line no-useless-escape
    const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/i);

    const public_id = match ? match[1] : "";

    await cloudinary.uploader.destroy(public_id);
    // console.log(`${public_id} is deleted form cloudinary`);
  } catch (error: any) {
    throw new AppError(401, "Cloudinary image deletion failed!", error.message);
  }
};
export const cloudinaryUpload = cloudinary;
