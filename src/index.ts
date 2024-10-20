import express from "express";
import userRoutes from './Routes/usersRoutes'
import adminRoutes from './Routes/adminRoutes'
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";

const app = express()
dotenv.config()

app.use(express.json())
app.use(logger)


app.use('/', userRoutes)
app.use('/admin', adminRoutes)

app.use(errorHandler)

app.listen('3000', () => {
  console.log('server is running')
})