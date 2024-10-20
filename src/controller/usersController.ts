import { NextFunction, Response, Request } from "express";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  
}

export const getHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send({message: "hello welcome "})
  } catch (error) {
    
  }
}