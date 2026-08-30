import type { NextFunction, Request, Response } from "express";
import AppError from "../ErrorHandler/appErrors";
import httpStatus from "http-status-codes";
import { verifyToken } from "./jwt";
import { envVars } from "../confic/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...restRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.cookies.accessToken || req.cookies.refreshToken || req.headers.authorization;
      
        if (!accessToken) throw new AppError(403, "token isn't available");
        
        const tokenVarify = verifyToken(accessToken, envVars.secret) as JwtPayload;

        if (!restRoles.includes(tokenVarify.role)) {
            throw new AppError(403, "you are not allowed to access this route");
        }
        req.user = tokenVarify;
        next();
    } catch (err) {
        next(err);
    }
}


// 1. do you have Token
// 2. tmr token ta ki valid, mane tmi j ticket dicho setar info tik ache kina check
// 3. tmr role ai route e dukar role er sate match kore kina
