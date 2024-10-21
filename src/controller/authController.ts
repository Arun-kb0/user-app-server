import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../constants/HttpError'
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from '../constants/httpStatusCodes'
import { prismaClient } from '../config/prismaClient'
import jwt from 'jsonwebtoken'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new HttpError('email and password is required', BAD_REQUEST)
    const user = await prismaClient.users.findFirst({
      where: { email }
    })
    if (!user) throw new HttpError('user not found ', NOT_FOUND)
    if (user.password !== password) throw new HttpError('invalid password ', UNAUTHORIZED)

    // * jwt
    const accessToken = jwt.sign(
      { "username": user.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '30s' }
    )
    const refreshToken = jwt.sign(
      { "username": user.email },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    )

    const updatedUser = await prismaClient.users.update({
      where: { userId: user.userId },
      data: { refreshToken },
    })

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(OK).json({ message: 'login success', accessToken })
  } catch (error) {
    next(error)
  }
}