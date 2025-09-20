import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVar } from "./env.config";
import AppError from "../errorHelpers/AppError";
import stream from "stream";

cloudinary.config({
  cloud_name: envVar.CLOUDINARY_CLOUD_NAME,
  api_secret: envVar.CLOUDINARY_API_SECRET,
  api_key: envVar.CLOUDINARY_API_KEY,
});
export const cloudinaryUpload = cloudinary;

export const cloudinaryBufferUpload = async (buffer: Buffer,fileName: string) : Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const publicId = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end();

      cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            public_id: publicId,
            folder: "pdf",
          },
          (error, result) => {
            if (error) reject(error);

            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

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
