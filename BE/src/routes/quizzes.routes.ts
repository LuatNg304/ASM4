import { Router } from 'express'

import {
  createManyQuestionsInQuiz,
  createQuestionInQuiz,
  createQuiz,
  deleteQuizById,
  getAllQuizzes,
  getById,
  getQuizQuestionsCapital,
  updateQuizById
} from '~/controllers/quizzes.controllers'
import { verifyAdmin } from '~/middlewares/quizs.middlewares'

const quizzesRouter = Router()
quizzesRouter.post('/', verifyAdmin, createQuiz)
quizzesRouter.get('/', getAllQuizzes)
quizzesRouter.get('/:id', getById)
quizzesRouter.put('/:id', verifyAdmin, updateQuizById)
quizzesRouter.delete('/:id', verifyAdmin, deleteQuizById)
quizzesRouter.get('/:quizId/populate', getQuizQuestionsCapital)
quizzesRouter.post('/:quizId/question', createQuestionInQuiz)
quizzesRouter.post('/:quizId/questions', createManyQuestionsInQuiz)

export default quizzesRouter
