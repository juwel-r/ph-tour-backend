import { Response } from "express";

interface IToken {
  accessToken?: string;
  refreshToken?: string;
}

export const setCookieAuth = (res: Response, token: IToken) => {
  if (token.accessToken) {
    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (token.refreshToken) {
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
