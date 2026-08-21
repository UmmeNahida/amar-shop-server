import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { AuthProvider, Role, UserStatus, type IUser } from "./user.interface.js";
import { User } from "./user.model.js";
import AppError from "../../ErrorHandler/appErrors.js";
import { envVars } from "../../confic/env.js";
import parseBufferToURI from "../../helper/datauri.js";
import cloudinary from "../../helper/cloudinary.js";

interface IUserInfo{
    
}

export const registerUser = async (req: any) => {
  console.log("---req",req)
  const isUserExists = await User.findOne({
    email: req.body.email,
  });

  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, "Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(envVars.bcrypt_salt_rounds),
  );

  const fileString = parseBufferToURI(req.file?.buffer) as string;

  const uploadFile = await cloudinary.uploader.upload(fileString, {
    folder: "nahida-assets",
  });

  const userData = {
    ...req.body,

    avatar: {
      public_id: uploadFile.public_id,
      url: uploadFile.secure_url,
    },

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
