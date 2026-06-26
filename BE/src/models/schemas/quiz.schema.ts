import { Schema, model, Types } from 'mongoose'

export interface IQuiz {
  title: string
  description: string
  questions: Types.ObjectId[]
}

const quizSchema = new Schema<IQuiz>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }
  ]
})

export default model<IQuiz>('Quiz', quizSchema)
