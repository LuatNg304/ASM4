import { Schema, Types, model } from 'mongoose'

export interface IQuestion {
  text: string
  options: string[]
  keywords: string[]
  correctAnswerIndex: number
  author: Types.ObjectId
}

const questionSchema = new Schema<IQuestion>({
  text: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  correctAnswerIndex: {
    type: Number,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export default model<IQuestion>('Question', questionSchema)
