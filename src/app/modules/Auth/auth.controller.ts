
import httpStatus from "http-status-codes"
import passport from "passport";
import { catchAsync } from "../../utils/catchAsync.js";
import type { NextFunction, Request, Response } from "express";
import AppError from "../../ErrorHandler/appErrors.js";
// import { createUserTokens } from "../../utils/userToken.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { sendResponse } from "../../utils/sendResponse.js";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(401, info?.message || err));
        }

        if (!user) {
            return next(new AppError(401, info?.message || "User does not exist"));
        }

        // const userToken = createUserTokens(user)
        //    console.log("userToken",userToken)

        // setAuthCookie(res, userToken)

        // remove password from user object
        delete user.toObject().password;

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "user login successfully",
            data: {
                // accessToken: userToken.accessToken,
                // refreshToken: userToken.refreshToken,
                user: user
            }

        })

    }

    )(req, res, next)


    // console.log(users)
})


export const authController = {
    credentialsLogin
}