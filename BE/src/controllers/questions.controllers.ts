import { Request, Response } from 'express'
import questionSchema from '~/models/schemas/question.schema'

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { decoded_authenrization } = req
    
    const author = decoded_authenrization?.userId

    const { text, options, keywords, correctAnswerIndex } = req.body

    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      return res.status(400).json({
        message: 'correctAnswerIndex is invalid'
      })
    }

    const question = await questionSchema.create({
      text,
      options,
      keywords,
      correctAnswerIndex,
      author
    })

    return res.status(201).json(question)
  } catch (error) {
    return res.status(500).json({
      message: 'Create question failed',
      error
    })
  }
}
export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await questionSchema.find()
    res.status(200).json(questions)
  } catch (error) {
    res.status(500).json({
      message: 'Get questions failed',
      error
    })
  }
}

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const question = await questionSchema.findById(req.params.id)
    if (!question) {
      return res.status(404).json({
        message: 'Question not found'
      })
    }
    res.status(200).json(question)
  } catch (error) {
    res.status(500).json({
      message: 'Get question failed',
      error
    })
  }
}
export const deleteQuestionById = async (req: Request, res: Response) => {
  try {
    const question = await questionSchema.findByIdAndDelete(req.params.id)
    if (!question) {
      return res.status(404).json({
        message: 'Question not found'
      })
    }
    res.status(200).json({
      message: 'Question deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Delete question failed',
      error
    })
  }
}
export const updateQuestionById = async (req: Request, res: Response) => {
  try {
    const { text, options, keywords, correctAnswerIndex } = req.body
    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      return res.status(400).json({
        message: 'correctAnswerIndex is invalid'
      })
    }
    const question = await questionSchema.findByIdAndUpdate(
      req.params.id,
      {
        text,
        options,
        keywords,
        correctAnswerIndex
      },
      { new: true }
    )
    if (!question) {
      return res.status(404).json({
        message: 'Question not found'
      })
    }
    res.status(200).json(question)
  } catch (error) {
    res.status(500).json({
      message: 'Update question failed',
      error
    })
  }
}
