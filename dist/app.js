"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passport.config");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); //for form data
app.use((0, cookie_parser_1.default)());
app.set("true proxy", 1);
app.use((0, cors_1.default)());
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to PH Tour management System",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.NotFoundRoute);
exports.default = app;
/** => Project Setup
 *
 * git init
 * .gitignore file create
 * npm init -y
 * npm i -D typescript
 * tsc --init
 * ->set root dir and outdir
 * install required packages
 * install all installed packages types -> @types/express
 * npm i -D ts-node-dev
 *
 * server.ts and app.ts file setup
 *
 * SIGTERM, uncaughtException, unhandledRejection error handle in server.ts
 *
 * TS Eslint setup
 *
 * EnvConfig Setup
 *
 *
 */
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
 * 10. JWT Setup ->
 *        create accessToken and refreshToken
 *
 *
 *
 *
 * create a middleware (checkAuth)
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
 * === Module 29 -> Passport js  for credential login ===
 *
 * passport js for credential login
 * handling mongoose error and zod error
 * create interface for tour and division
 *
 *
 * === === Module 30 -> Tour and division === ===
 * creating slug manually in service
 * creating slug with schema Pre hooks (query hooks and documents hooks)
 * Filter, search, limit, skip, pagination, meta and query with manually
 * Class (query builder) creating for reuse queries
 *
 *
 * === === Module 31 -> Tour and division === ===
 * booking and payment Module
 * 31.4-> sessionTransaction() used for "rollback transaction"
 * use try catch
 * if used session then must pass payload of .create() as array of object. not in update()
 * session not work in local Mongodb it run always live server
 *
 * 31.5, 31.6 -> SSL Commerz Setup
 *
 *
 * === === Module 32- Cloudinary Setup and node mailer setup === ===
 *
 * Cloudinary config
 * multer config with multer-storage-cloudinary
 * update validateRequest for received file
 * app middleware in app.ts for formdata
 * upload single and multiple photo in cloudinary
 *  and delete single and multiple photo from cloudinary
 * delete uploaded photo from cloudinary if any error occurred white execution
 *
 * created set password api reset password api forgot api and send forgot link via email by using nodemailer
 * config nodemailer with google "App Password"
 *
 *  * === === Module 33- Redis Setup === ===
 * config redis and set connect in server.ts
 * generate otp and verify
 *
* create a Invoice pdf using "pdfkit" send invoice pdf via email
* upload pdf in cloudinary (must need to enable pdf and zip sharing in cloudinary)
* create a api for get invoice pdf
*
* create stats for user booking payment
*
* need to modify secure:true for production and sameSite:"none" and config cors and set trust proxy
* deploy to vercel
*
 *
 */
