import { Router } from "express";
import { authRoute } from "../modules/Auth/auth.route.js";
import { UserRoutes } from "../modules/User/user.router.js";

export const routes = Router();

const moduleRoutes = [
    {
        path:"/auth",
        route: authRoute
    },
    {
        path:"/user",
        route: UserRoutes
    },
]


moduleRoutes.forEach((route)=>{
    routes.use(route.path, route.route)
})