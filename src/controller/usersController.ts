import { NextFunction, Response, Request } from "express";
import { prismaClient } from "../config/prismaClient";
import { Users } from "@prisma/client";
import { OK } from "../constants/httpStatusCodes";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prismaClient.users.findMany()
    res.status(OK).json({ users })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body
    console.log(user)
    const newUser = await prismaClient.users.create({ data: user })
    res.status(OK).json({ message: 'user created', newUser })
  } catch (error) {
    next(error)
  }
}


export const getProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const getHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send({ message: "hello welcome " })
  } catch (error) {

  }
}