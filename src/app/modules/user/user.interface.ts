
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUID = "GUID",
}

export interface AuthProvider {
  provider: "google" | "credential";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCK = "BLOCK",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: Role;
  isActive?: IsActive;
  isVerified?: boolean;
  isDelete?: string;
  auth: AuthProvider[];
  // bookings: Types.ObjectId[];
  // guides: Types.ObjectId[];
}
