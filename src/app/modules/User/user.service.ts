import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { AuthProvider, Role, UserStatus } from "./user.interface.js";
import { User } from "./user.model.js";
import AppError from "../../ErrorHandler/appErrors.js";
import { envVars } from "../../confic/env.js";

export const registerUser = async (payload: any) => {
  const isUserExists = await User.findOne({
    email: payload.email,
  });

  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, "Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(envVars.bcrypt_salt_rounds)
  );

  const userData = {
    ...payload,

    password: hashedPassword,

    role: Role.CUSTOMER,

    provider: AuthProvider.CREDENTIALS,

    status: UserStatus.ACTIVE,

    isVerified: false,

    addresses: [],
  };

  const user = await User.create(userData);

  const result = await User.findById(user._id).select("-password");

  return result;
};

