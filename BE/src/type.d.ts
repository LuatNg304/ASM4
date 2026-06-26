import { IUser } from '~/models/schemas/user.schema'
import { Request } from 'express'
import { TokenPayload } from './models/request/user.request'
declare module 'express' {
  interface Request {
    user?: IUser
    decoded_authenrization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
