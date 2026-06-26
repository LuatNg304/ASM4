import { Request, Response } from 'express'
import questionSchema from '~/models/schemas/question.schema'
import quizSchema from '~/models/schemas/quiz.schema'

export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await quizSchema.find().populate('questions')

    res.status(200).json(quizzes)
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching quizzes',
      error
    })
  }
}
export const getById = async (req: Request, res: Response) => {
  try {
    const quiz = await quizSchema.findById(req.params.id).populate('questions')
    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }
    res.status(200).json(quiz)
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching quiz',
      error
    })
  }
}
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description, questions } = req.body
    const quiz = await quizSchema.create({
      title,
      description,
      questions
    })
    res.status(201).json(quiz)
  } catch (error) {
    res.status(500).json({
      message: 'Error creating quiz',
      error
    })
  }
}
export const updateQuizById = async (req: Request, res: Response) => {
  try {
    const { title, description, questions } = req.body
    const quiz = await quizSchema.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        questions
      },
      { new: true }
    )
    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }
    res.status(200).json(quiz)
  } catch (error) {
    res.status(500).json({
      message: 'Error updating quiz',
      error
    })
  }
}
export const deleteQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await quizSchema.findByIdAndDelete(req.params.id)
    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }
    res.status(200).json({
      message: 'Quiz deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting quiz',
      error
    })
  }
}
export const getQuizQuestionsCapital = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params

    const quiz = await quizSchema.findById(quizId).populate({
      path: 'questions',
      match: {
        text: { $regex: 'capital', $options: 'i' }
      }
    })

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }

    res.status(200).json(quiz)
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching quiz'
    })
  }
}
export const createQuestionInQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params

    const { text, options, keywords, correctAnswerIndex } = req.body

    // Tạo Question
    const question = await questionSchema.create({
      text,
      options,
      keywords,
      correctAnswerIndex
    })

    // Thêm question vào quiz
    const quiz = await quizSchema
      .findByIdAndUpdate(
        quizId,
        {
          $push: {
            questions: question._id
          }
        },
        { new: true }
      )
      .populate('questions')

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }

    res.status(201).json({
      message: 'Question added to quiz successfully',
      quiz
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error creating question',
      error
    })
  }
}
export const createManyQuestionsInQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params

    const quiz = await quizSchema.findById(quizId)

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }

    // Tạo nhiều question
    const questions = await questionSchema.insertMany(req.body)

    // Lấy danh sách _id
    const questionIds = questions.map((q) => q._id)

    // Thêm vào quiz
    quiz.questions.push(...questionIds)
    await quiz.save()

    const updatedQuiz = await quizSchema.findById(quizId).populate('questions')

    res.status(201).json({
      message: 'Questions added successfully',
      quiz: updatedQuiz
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error creating questions',
      error
    })
  }
}
