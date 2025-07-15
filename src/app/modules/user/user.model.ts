import { model, Schema } from "mongoose";
import { AuthProvider, IsActive, IUser, Role } from "./user.interface";

const AuthProviderSchema = new Schema<AuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auth: [AuthProviderSchema],
    //   bookings:{
    //     type:String,
    //   },
    //   guides:{
    //     type:String,
    //   }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<IUser>("User", UserSchema);
