import { SignOptions } from 'jsonwebtoken'
import { Types } from 'mongoose'
import { TokenType } from '~/constants/enum'
import { RegisterRequest } from '~/models/request/user.request'
import refreshTokenSchema from '~/models/schemas/refreshToken.schema'
import userSchema from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class UsersService {
  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN! as SignOptions['expiresIn']
      }
    })
  }
  private signRefreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN! as SignOptions['expiresIn']
      }
    })
  }
  private signToken(userId: string) {
    return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }
  async register(payload: RegisterRequest) {
    const result = await userSchema.create({
      ...payload,
      password: hashPassword(payload.password)
    })
    const userObjectId = result._id
    const userId = result._id.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(userId),
      this.signRefreshToken(userId)
    ])
    await refreshTokenSchema.insertOne({
      token: refresh_token,
      user_id: userObjectId
    })
    return {
      access_token,
      refresh_token
    }
  }
  async findByUsername(username: string) {
    const user = await userSchema.findOne({ username })
    return Boolean(user)
  }
  async login(userId: string) {
    const [access_token, refresh_token] = await this.signToken(userId)
    await refreshTokenSchema.insertOne({
      token: refresh_token,
      user_id: new Types.ObjectId(userId)
    })
    return {
      access_token,
      refresh_token
    }
  }
  async logout(refreshToken: string) {
    await refreshTokenSchema.deleteOne({ token: refreshToken })
  }
  async getAllUsers() {
    const users = await userSchema.find()
    return users
  }
}

const usersService = new UsersService()
export default usersService
