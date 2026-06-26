import { Router } from 'express'
import {
  createQuestion,
  deleteQuestionById,
  getAllQuestions,
  getQuestionById,
  updateQuestionById
} from '~/controllers/questions.controllers'
import { vertifyAuthor } from '~/middlewares/questions.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const questionsRouter = Router()

questionsRouter.post('/', accessTokenValidator, createQuestion)
questionsRouter.get('', getAllQuestions)
questionsRouter.get('/:id', getQuestionById)
questionsRouter.put('/:id', vertifyAuthor, updateQuestionById)
questionsRouter.delete('/:id', vertifyAuthor, deleteQuestionById)
export default questionsRouter
