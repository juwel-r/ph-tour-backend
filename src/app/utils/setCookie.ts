import { Response } from "express";
import { envVar } from "../config/env.config";

interface IToken {
  accessToken?: string;
  refreshToken?: string;
}

export const setCookieAuth = (res: Response, token: IToken) => {
  if (token.accessToken) {
    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: envVar.NODE_ENV === "production",
      sameSite: "none",
    });
  }

  if (token.refreshToken) {
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: envVar.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};
