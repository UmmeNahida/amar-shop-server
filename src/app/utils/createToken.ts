
import { envVars } from "../confic/env"
import { generateToken } from "./jwt"


export const createUserTokens = (user: any) => {
    const jwtPayload = {
        _id: user?._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVars.secret, envVars.expiresIn)

    const refreshToken = generateToken(jwtPayload, envVars.secret, envVars.expiresIn)


    return {
        accessToken,
        refreshToken
    }
}