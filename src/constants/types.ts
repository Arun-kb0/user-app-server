import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: string;
}

export interface SendJwtPayload extends JwtPayload {
  username?: string
}

 type TokenCookie = {
  username: string
}