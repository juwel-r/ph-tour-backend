/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleCastError, handleDuplicateError, handleValidationError } from "../errorHelpers/mongooseError";
import { handleZodError } from "../errorHelpers/zodError";


export const globalErrorHandler = (error: any,req: Request,res: Response,next: NextFunction) => {

  if(envVar.NODE_ENV === "development" ? error.stack : null){
    console.log(error);
  }

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
