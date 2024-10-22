import express from "express";
import userRoutes from './Routes/usersRoutes'
import adminRoutes from './Routes/adminRoutes'
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import cors from 'cors'
import verifyJWT from "./middleware/verifyJWT";
import authRoutes from './Routes/authRoutes'
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions";
import credentials from "./middleware/credentials";

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())

app.use(logger)
app.use(credentials)
app.use(cors(corsOptions))

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)

app.use(verifyJWT)
app.use('/', userRoutes)

app.use(errorHandler)

app.listen('3000', () => {
  console.log('server is running')
})