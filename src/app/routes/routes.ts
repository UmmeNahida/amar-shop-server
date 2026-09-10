import { Router } from "express";
import { authRoute } from "../modules/Auth/auth.route.js";
import { UserRoutes } from "../modules/User/user.router";
import { categoryRouter } from "../modules/Category/category.route.js";
import { brandRouter } from "../modules/Brand/brand.route.js";
import { productRouter } from "../modules/Product/product.route.js";
import { myCartRouter } from "../modules/MyCart/myCart.route.js";

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
    {
        path:"/brand",
        route: brandRouter
    },
    {
        path:"/product",
        route: productRouter
    },
    {
        path:"/myCart",
        route: myCartRouter
    },
]


moduleRoutes.forEach((route)=>{
    routes.use(route.path, route.route)
})


