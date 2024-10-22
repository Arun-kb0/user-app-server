import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../constants/HttpError'
import { BAD_REQUEST, FORBIDDEN, NO_CONTENT, NOT_FOUND, OK, UNAUTHORIZED } from '../constants/httpStatusCodes'
import { prismaClient } from '../config/prismaClient'
import jwt, { JwtPayload, VerifyCallback, VerifyErrors } from 'jsonwebtoken'
import { AuthRequest, SendJwtPayload } from '../constants/types'


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
      sameSite: 'none',
      secure:true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(OK).json({ message: 'login success', accessToken })
  } catch (error) {
    next(error)
  }
}


export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies
    if (!cookies?.jwt) throw new HttpError('cookie not found', UNAUTHORIZED)

    console.log(cookies.jwt)
    const refreshToken = cookies.jwt
    const user = await prismaClient.users.findFirst({
      where: { refreshToken }
    })
    if (!user) throw new HttpError('user not found ', FORBIDDEN)

    const verifyCallback: VerifyCallback = (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err || !decoded || typeof decoded === 'string' || user.email !== decoded.username) {
        throw new HttpError('token tampered', FORBIDDEN);
      }
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '30s' }
      )
      res.status(OK).json({ message: 'login success', accessToken })
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      verifyCallback
    )

  } catch (error) {
    next(error)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies
    console.log(cookies)
    if (!cookies.jwt) throw new HttpError('no cookie found logout success', NO_CONTENT)
    const refreshToken = cookies.jwt

    const user = await prismaClient.users.findFirst({
      where: { refreshToken }
    })
    if (!user) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      throw new HttpError('no user found logout success', NO_CONTENT)
    }

    // * delete refresh token in db
    await prismaClient.users.update({
      where: { userId: user.userId },
      data: { refreshToken: '' }
    })
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    res.sendStatus(NO_CONTENT)

  } catch (error) {
    next(error)
  }
}