import { NextFunction, Response, Request } from "express";
import { prismaClient } from "../config/prismaClient";
import { Users } from "@prisma/client";
import { BAD_REQUEST, OK } from "../constants/httpStatusCodes";
import { HttpError } from "../constants/HttpError";

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
    if (!user) throw new HttpError('user is required', BAD_REQUEST)
    const newUser = await prismaClient.users.create({ data: user })
    res.status(OK).json({ message: 'user created', newUser })
  } catch (error) {
    next(error)
  }
}


export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    const user = req.body
    if (!userId || typeof userId !== 'string') throw new HttpError('userId is invalid', BAD_REQUEST)
    if (!user || Object.keys(user).length===0 ) throw new HttpError('user is required', BAD_REQUEST)
    const newUser = await prismaClient.users.update({
      where: { userId: userId },
      data: user
    })
    res.status(OK).json({ message: 'user created', newUser })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId || typeof userId !== 'string') throw new HttpError('userId is invalid', BAD_REQUEST)
    const user = await prismaClient.users.delete({
      where: { userId }
    })
    res.status(OK).json({ message: 'user deleted', user })
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