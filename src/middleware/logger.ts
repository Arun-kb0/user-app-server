import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const formattedMsg = `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  console.info(formattedMsg)
  next()
}