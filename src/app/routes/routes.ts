import { Router } from "express";
import { authRoute } from "../modules/Auth/auth.route.js";
import { UserRoutes } from "../modules/User/user.router";
import { categoryRouter } from "../modules/Category/category.route.js";

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
    {
        path:"/category",
        route: categoryRouter
    },
]


moduleRoutes.forEach((route)=>{
    routes.use(route.path, route.route)
})