/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleCastError, handleDuplicateError, handleValidationError } from "../errorHelpers/mongooseError";
import { handleZodError } from "../errorHelpers/zodError";
import { cloudinaryDelete } from "../config/cloudinary";


export const globalErrorHandler =async (error: any,req: Request,res: Response,next: NextFunction) => {
  if(envVar.NODE_ENV === "development" ? error.stack : null){
    // eslint-disable-next-line no-console
    console.log(error);
  }

//Cloudinary image delete if error occurred while execution
  if(req.file){
    await cloudinaryDelete(req.file.path)
  }

  if(req.files && Number(req.files.length) > 0){
    const urls = (req.files as Express.Multer.File[]).map(file => file.path);

    await Promise.all(urls.map(url=>cloudinaryDelete(url)))
  }

  //Error handle
  let statusCode = 500;
  let message = error.message;

  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.StatusCode;
    message = simplifiedError.message;
  } 
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError();
    statusCode = simplifiedError.StatusCode;
    message = simplifiedError.message;
  } 
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.StatusCode;
    message = simplifiedError.message;
  }
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error:envVar.NODE_ENV === "development" ? error : null,
    stack: envVar.NODE_ENV === "development" ? error.stack : null,
  });
};
