

import { Router } from "express";
import * as authController from "./auth.controller";


const route = Router()

route.post("/login", authController.credentialsLogin)



export const authRoute = route;