import { Router } from "express";
import { AuthController } from "./auth.controller";

const route = Router();
route.post('/login', AuthController.credentialLogin)
route.post('/refresh-token', AuthController.getNewAccessToken)
export const AuthRoute = route;
