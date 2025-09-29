import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVar } from "../../config/env.config";

const route = Router();
route.post("/login", AuthController.credentialLogin);
route.post("/refresh-token", AuthController.getNewAccessToken);
route.post("/logout", AuthController.logout);
route.post("/change-password",checkAuth(...Object.values(Role)),AuthController.changePassword);
route.post("/set-password",checkAuth(...Object.values(Role)),AuthController.setPassword);
route.post("/forgot-password", AuthController.forgotPassword);
route.post("/reset-password",checkAuth(...Object.values(Role)),AuthController.resetPassword);

//state will received in callback route
route.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", {scope: ["profile", "email"],state: redirect as string,})(req, res, next);
  }
);

route.get(
  "/google/callback",
  passport.authenticate("google", {failureRedirect: `${envVar.FRONTEND_URL}/login`,failureMessage:true}),
  AuthController.googleCallback
);

export const AuthRoute = route;
