"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_config_1 = require("./env.config");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
{
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_config_1.envVar.GOOGLE_CLIENT_ID,
        clientSecret: env_config_1.envVar.GOOGLE_CLIENT_SECRET,
        callbackURL: env_config_1.envVar.GOOGLE_CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
            if (!email) {
                return done(null, false, { message: "Email not found!" });
            }
            let user = yield user_model_1.User.findOne({ email });
            if ((user === null || user === void 0 ? void 0 : user.isActive) !== user_interface_1.IsActive.ACTIVE) {
                return done(`User is ${user === null || user === void 0 ? void 0 : user.isActive}`);
            }
            if (user === null || user === void 0 ? void 0 : user.isDelete) {
                return done(null, false, { message: "User is deleted." });
            }
            // if (!user?.isVerified) {
            //   return done(null, false, { message: "User is not verified."});
            // }
            if (!user) {
                user = yield user_model_1.User.create({
                    email,
                    name: profile.displayName,
                    picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                    isVerified: true,
                    role: user_interface_1.Role.USER,
                    auth: [
                        {
                            provider: "google",
                            providerId: profile.id,
                        },
                    ],
                });
            }
            return done(null, user);
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.log("Google Strategy Error", error);
            return done(error);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    }));
}
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done("No user exist with this email!");
        }
        if (isUserExist.isActive !== user_interface_1.IsActive.ACTIVE) {
            done(`User is ${isUserExist.isActive}`);
        }
        if (!isUserExist.isVerified) {
            done(`User email is not verified.`);
        }
        if (isUserExist.isDelete) {
            return done("User is deleted.");
        }
        // if (!isUserExist.isVerified) {
        //   return done("User is not verified.");
        // }
        //done(error, user, info) -> jehetu 1st parameter eroor so just error ta dilei hobe baki gula na dileo hobe
        const isGoogleAuthenticated = isUserExist.auth.some((providerObjects) => providerObjects.provider == "google");
        const isCredentialUser = isUserExist.auth.some((p) => p.provider === "credential");
        if (!isCredentialUser && isGoogleAuthenticated) {
            return done("You are Google Authenticated user. Please set password for your account to login with email and password.");
        }
        const isPasswordMatch = bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatch) {
            return done("Password not matched!.");
        }
        return done(null, isUserExist);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        done(error);
    }
})));
