import { NextFunction, Request, Response } from "express";
import { HttpError } from "../constants/HttpError";

export const errorHandler = async (err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
  let statusCode: number
  let message: string
  if (err instanceof HttpError) {
    statusCode = err.statusCode
    message = err.message
  } else {
    statusCode = 500
    message = 'Internal server error'
  }
  console.error(err)
  res.status(statusCode).json({ message })
}