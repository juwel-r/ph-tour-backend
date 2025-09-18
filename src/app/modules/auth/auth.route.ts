import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const route = Router();
route.post('/login', AuthController.credentialLogin)
route.post('/refresh-token', AuthController.getNewAccessToken)
route.post('/logout', AuthController.logout)
route.post('/change-password', checkAuth(...Object.values(Role)), AuthController.changePassword);
route.post('/reset-password', checkAuth(...Object.values(Role)), AuthController.resetPassword);
route.post('/set-password', checkAuth(...Object.values(Role)), AuthController.setPassword);

//state will received in callback route
route.get('/google',async (req:Request, res:Response, next:NextFunction)=>{
    const redirect = req.query.redirect || '/'
    passport.authenticate('google',{scope:['profile', 'email'], state:redirect as string})(req, res, next)
})

route.get('/google/callback', passport.authenticate("google", {failureRedirect:'/login'}), AuthController.googleCallback)

export const AuthRoute = route;
