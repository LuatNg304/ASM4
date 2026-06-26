import { Schema, model } from 'mongoose'

export interface IUser {
  username: string
  password: string
  admin: boolean
  
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  
})

export default model<IUser>('User', userSchema)
