import { TokenPayload } from '~/models/request/user.request'
import { PrivateKey, SignOptions } from './../../node_modules/@types/jsonwebtoken/index.d'
import jwt from 'jsonwebtoken'

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRECT as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}

export const verifyToken = ({
  token,
  publicKey = process.env.JWT_SECRECT as string
}: {
  token: string
  publicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, publicKey, (err, payload) => {
      if (err) {
        throw reject(err)
      } else {
        resolve(payload as TokenPayload)
      }
    })
  })
}
