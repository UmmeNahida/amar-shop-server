import AppError from "@/app/ErrorHandler/appErrors"
import { UserStatus } from "../User/user.interface"
import { User } from "../User/user.model"
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { createUserTokens } from "@/app/utils/createToken";


export const credentialsLogin = async(payload: {email: string, password: string})=>{
     
    const user = await User.findOne({ email: payload.email, status:UserStatus.ACTIVE})
    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST, "email is incorrect")
    }
   
    const isMatchPass = await bcrypt.compare(payload.password, user.password as string)

    if(!isMatchPass){
        throw new AppError(httpStatus.BAD_REQUEST, "password is incorrect")
    }

    const {accessToken, refreshToken} = createUserTokens(user)

   
    return {
        accessToken,
        refreshToken,
        user: user
    }
}

