/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
  }

  res.status(500).json({
    success: false,
    message: error.message,
    error,
    stack: envVar.NODE_ENV === "development" ? error.stack : null,
  });
};
