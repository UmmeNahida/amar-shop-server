// import httpStatus from "@/constants";
import { setAuthCookie } from "@/app/utils/setCookie";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as AuthService from "./auth.service"
import httpStatus from "http-status-codes"



export const credentialsLogin = catchAsync(async(req,res)=>{
  const userInfo = req.body;
  const result = await AuthService.credentialsLogin(userInfo)
   setAuthCookie(res, {accessToken:result.accessToken, refreshToken:result.refreshToken})

   sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully.",
    data: result,
  });
})


