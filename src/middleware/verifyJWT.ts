import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction, } from 'express'
import { HttpError } from '../constants/HttpError'
import { FORBIDDEN, UNAUTHORIZED } from '../constants/httpStatusCodes'
import { AuthRequest } from '../constants/types'


const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new HttpError('Unauthorized', UNAUTHORIZED)
    console.log(authHeader) // barer 
    const token = authHeader?.split(' ')[1]
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') throw new HttpError('Forbidden', FORBIDDEN)
        if (!decoded.username) throw new HttpError('Forbidden', FORBIDDEN)
        req.user =  decoded.username 
        next()
      }
    )

  } catch (error) {
    next(error)
  }



}

export default verifyJWT 