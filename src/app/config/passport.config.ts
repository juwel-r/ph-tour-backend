import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVar } from "./env.config";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

{
  passport.use(
    new GoogleStrategy(
      {
        clientID: envVar.GOOGLE_CLIENT_ID,
        clientSecret: envVar.GOOGLE_CLIENT_SECRET,
        callbackURL: envVar.GOOGLE_CALLBACK_URL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const email = profile.emails?.[0].value;
          if (!email) {
            return done(null, false, { message: "Email not found!" });
          }

          let user = await User.findOne({ email });

          if (user?.isActive !== IsActive.ACTIVE) {
            return done(`User is ${user?.isActive}`);
          }

          if (user?.isDelete) {
            return done(null, false, { message: "User is deleted." });
          }

          // if (!user?.isVerified) {
          //   return done(null, false, { message: "User is not verified."});
          // }

          if (!user) {
            user = await User.create({
              email,
              name: profile.displayName,
              picture: profile.photos?.[0].value,
              isVerified: true,
              role: Role.USER,
              auth: [
                {
                  provider: "google",
                  providerId: profile.id,
                },
              ],
            });
          }
          return done(null, user);
        } catch (error) {
          console.log("Google Strategy Error", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser(
    (user: any, done: (err: any, id?: unknown) => void) => {
      done(null, user._id);
    }
  );

  passport.deserializeUser(async (id: string, done: any) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done("No user exist with this email!");
        }

        if (isUserExist.isActive !== IsActive.ACTIVE) {
          done(`User is ${isUserExist.isActive}`);
        }

        if (isUserExist.isDelete) {
          return done("User is deleted.");
        }

        // if (!isUserExist.isVerified) {
        //   return done("User is not verified.");
        // }
        //done(error, user, info) -> jehetu 1st parameter eroor so just error ta dilei hobe baki gula na dileo hobe

        const isGoogleAuthenticated = isUserExist.auth.some(
          (providerObjects) => providerObjects.provider == "google"
        );
        const isCredentialUser = isUserExist.auth.some(
          (p) => p.provider === "credential"
        );

        if (!isCredentialUser && isGoogleAuthenticated) {
          return done(
            "You are Google Authenticated user. Please set password for your account to login with email and password."
          );
        }

        const isPasswordMatch = bcryptjs.compare(
          password,
          isUserExist.password as string
        );

        if (!isPasswordMatch) {
          return done("Password not matched!.");
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);
