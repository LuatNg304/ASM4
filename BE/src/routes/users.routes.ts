import { Router } from 'express'
import { getAllUsers, loginController, logoutController, registerUser } from '~/controllers/users.controllers'
import { verifyAdmin } from '~/middlewares/quizs.middlewares'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidation
} from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/register', registerValidation, registerUser)
usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, logoutController)
usersRouter.get('', verifyAdmin, getAllUsers)
export default usersRouter
