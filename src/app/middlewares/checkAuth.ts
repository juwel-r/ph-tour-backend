//(...authRoles:string[]) -> ata holo ai middleware ta je route ar jonno use kora hobe sei route ta kon typer user ar jonno accescible, route theke seta param hisabe patabe

import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      // const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No access token received");
      }

      // const verifiedToken = jwt.verify(accessToken, "secret");
      const verifiedToken = verifyToken(
        accessToken,
        envVar.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "You are not authorized person for this route."
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
