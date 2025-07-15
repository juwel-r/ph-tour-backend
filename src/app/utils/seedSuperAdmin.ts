/* eslint-disable no-console */
import { envVar } from "../config/env";
import { AuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVar.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin is already Exist.");
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVar.SUPER_ADMIN_PASSWORD,
      Number(envVar.BCRYPT_SALT_ROUND)
    );

    const authProvider: AuthProvider = {
      provider: "credential",
      providerId: envVar.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      email: envVar.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      password: hashedPassword,
      auth: [authProvider],
      isVerified: true,
    };

    const superAdmin = await User.create(payload);
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
 