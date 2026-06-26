import { Schema, model, Types } from 'mongoose'

export interface IRefreshToken {
  token: string
  user_id: Types.ObjectId
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema)