import express, { type Request, type Response } from "express"
import { routes } from "./app/routes/routes.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import expressSession from "express-session"
import { globalErrHandler } from "./app/middlewares/glovalErrHandler";
import httpStatus from "http-status-codes";
// import { routes } from "./app/routes/routes";
const app = express()

//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser())

// express-session first
app.use(expressSession({
  secret:"your secret",
  resave:false,
  saveUninitialized:false
  
}))

// cors
app.use(cors({
  origin:["http://localhost:5173","https://assignment-6-neon-eight.vercel.app"],
  credentials: true,
}))

// route endpoint
app.use('/api/v1',routes)

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})


// 404 handler 
app.use((req:Request, res:Response)=>{
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message:"Page not fount"
  })
})  

app.use(globalErrHandler);



export default app;

