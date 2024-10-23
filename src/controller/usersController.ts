import { NextFunction, Response, Request } from "express";
import { prismaClient } from "../config/prismaClient";
import { Users } from "@prisma/client";
import { BAD_REQUEST, OK } from "../constants/httpStatusCodes";
import { HttpError } from "../constants/HttpError";
import { roles } from "../constants/enums";

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
    console.log("user = ")
    console.log(user)
    const newUser = await prismaClient.users.create({ data: { ...user, role: roles.user } })
    res.status(OK).json({ message: 'user created', user: newUser })
  } catch (error) {
    next(error)
  }
}


export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    const user = req.body
    if (!userId || typeof userId !== 'string') throw new HttpError('userId is invalid', BAD_REQUEST)
    if (!user || Object.keys(user).length === 0) throw new HttpError('user is required', BAD_REQUEST)
    const newUser = await prismaClient.users.update({
      where: { userId: userId },
      data: user
    })
    console.log(newUser)
    res.status(OK).json({ message: 'user created', user: newUser })
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


export const addProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    const { photo } = req.body
    if (!userId || typeof userId !== 'string') {
      throw new HttpError('Invalid userId', BAD_REQUEST)
    }
    if (!photo || typeof photo !== 'string') {
      throw new HttpError('Invalid photo url', BAD_REQUEST)
    }
    const updatedUser = await prismaClient.users.update({
      where: { userId },
      data: { photo }
    })
    const { refreshToken, password, ...rest } = updatedUser
    res.status(OK).json({ message: 'image uploaded', user: rest })
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

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchText } = req.query
    if (!searchText || typeof searchText !== 'string') {
      throw new HttpError('search string must be valid string', BAD_REQUEST)
    }
    const users = await prismaClient.users.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: searchText,
              mode: 'insensitive'
            }
          },
          {
            name: {
              endsWith: searchText,
              mode: 'insensitive'
            }
          },
          {
            email: {
              startsWith: searchText,
              mode: 'insensitive'
            }
          },
        ]
      }
    })
    res.status(OK).json({ message: 'searching success', users })
  } catch (error) {
    next(error)
  }
}