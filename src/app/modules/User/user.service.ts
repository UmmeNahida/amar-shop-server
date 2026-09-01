
import bcrypt from "bcryptjs";
import { AuthProvider, IAddress, Role, UserStatus, type IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "@/app/ErrorHandler/appErrors";
import { envVars } from "@/app/confic/env";
import parseBufferToURI from "@/app/helper/datauri";
import cloudinary from "@/app/helper/cloudinary";
import httpStatus from "http-status-codes";

// register
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

// all users
export const allUsers = async()=>{
  const users = await User.find()

  return users
}

// get_my_profile
export const getMyProfile = async (userId: string) => {
  const user = await User.findById({_id: userId}).select("-password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};


// update profile done
export const updateMyProfile = async (
  userId: string,
  payload: {
    fullName?: string;
    phone?: string;
    avatar?: {
      public_id: string;
      url: string;
    };
  }
) => {
  const user = await User.findOne({
    _id: userId,
    status: UserStatus.ACTIVE,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return User.updateOne({_id: userId},payload);
};


// --------------------Start Address Logic
// add address 
export const addAddress = async (
  userId: string,
  payload: IAddress
) => {
  const user = await User.findOne({
    _id: userId,
    status: UserStatus.ACTIVE,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isFirstAddress = user.addresses.length === 0;

  user.addresses.push({
    ...payload,
    isDefault: isFirstAddress ? true : payload.isDefault ?? false,
  });

  if (payload.isDefault) {
    user.addresses.forEach((address, index) => {
      console.log("address",address, "index:", index)
      if (index !== user.addresses.length - 1) {
        address.isDefault = false;
      }
    });
  }

  await user.save();

  return user.addresses;
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  payload: Partial<IAddress>
) => {
  const user = await User.findOne({
    _id: userId,
    status: UserStatus.ACTIVE,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Address not found"
    );
  }

  Object.assign(address,payload)

  if(payload.isDefault === true){
    
    user.addresses.forEach(item=>{
      if(item._id.toString() !== addressId){
           item.isDefault = false
      }
    })
  }
  await user.save();
  return address;
};


// delete address 
 export const deleteAddress = async (
  userId: string,
  addressId: string
) => {
  const user = await User.findOne({
    _id: userId,
    status: UserStatus.ACTIVE,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Address not found"
    );
  }

  const wasDefault = address.isDefault;

  address.deleteOne();

  // if Default Address is delete 
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return user.addresses;
};


export const setDefaultAddress = async (
  userId: string,
  addressId: string
) => {
  const user = await User.findOne({
    _id: userId,
    status: UserStatus.ACTIVE,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Address not found"
    );
  }

  user.addresses.forEach((item) => {
    item.isDefault = item._id?.toString() === addressId;
  });

  await user.save();

  return user.addresses;
}; 
