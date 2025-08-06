import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { NotFoundRoute } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";

const app = express();

app.use(
  expressSession({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to PH Tour management System",
  });
});

app.use(globalErrorHandler);
app.use(NotFoundRoute);

export default app;

//Progress
/**
-> Route match form app.ts 
-> Again route match and send to control 
-> then for complete action goto service 
-> service will connect with model and return result 
-> then controller will output result


//Need to work by serial of =>
-> create model
-> create service
-> create route
 */

/**
 * Module Summary ==>> Module 26
 * 
 * 1. Create Modular MVC pattern
 * 2. Create environment variable configuration
 * 
 * 3. In each Module include by serial ->
 *    3.1. interface (data type)
 *    3.2. model     (Mongoose schema)
 *    3.3. service   (connection with mongoose via model, what operation perform I want)
 *    3.4. controller (use service in controller and connect with router)
 *        3.4.1. In controller use Higher-Order Function to avoid rewrite try-catch syntax for every CRUD.
 *        3.4.2. In controller use a custom response Function to keep response pattern organized for all
 *    3.5. router  (use specific controller to perform specific action)
 * 
 * 4. Create "unhandledRejection", "uncaughtException", "SIGTERM" Error handler in "server.ts" to stop server safely
 * 
 * 5. Create global error handler middleware
 * 6. Create not found route middleware
 * 7. Create Custom Error Class by extending default Error Class to send error status with response (AppError)




 
 * Module Summary ==>> Module 27 <<====
 * 8. Create a middleware for validating request via Zod and use that on router file.
 * 9. Hash Password to create login API.
 * 10. JWT Setup -> create a middleware (checkAuth)
 * 11. Create a API for Update User and validate permissions, must set validation middleware in route which made with ZOD
 * 12. Create a seedSuperAdmin to create a Super Admin Role in database at initiate of Server.
 * 13. Create custom Global Type for Express Request (req.user) and applied store verifiedToken data in req.user
 * 
 


 * Module Summary ==>> Module 28 <<====
 * 
 * Create Refresh token and create accessToken with refreshToken
 * set tokens in cookies and get tokens from cookies
 * create logout api
 * create reset or change password api
 * 
 * 
 * === Passport js  for google login===
 * Passport js for Third Party Authentication with Google Cloud
 * configuration passport js in app.ts with "app.use" 
        middleware => passport.initialize() and passport.session() and use express-session middleware
 *
 * Setup passport js in config folder as passport.ts
 * need to serializeUser and deserializeUser Setup
 * finally import passport config file in app.ts
 *  >** must use "express-session" middleware before" passport.initialize" and "passport.session"
 * setup  and dynamic redirect route of frontend in with state by received query in "/api/v1/auth/google" route
 * 
 * === Passport js  for credential login===
 * 
 * 
 */
