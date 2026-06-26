import { JwtPayload } from "jsonwebtoken"
import { TokenType } from "~/constants/enum"

export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
}
export interface TokenPayload extends JwtPayload {
  userId: string
  tokenType: TokenType
}
export interface LogoutRequest {
  refreshToken: string
}

