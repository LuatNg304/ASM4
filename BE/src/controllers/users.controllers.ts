import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { log } from 'node:console'
import { LogoutRequest, RegisterRequest } from '~/models/request/user.request'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validations'

export const registerUser = async (req: Request<ParamsDictionary, any, RegisterRequest>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    res.status(201).json({
      message: 'User registered successfully',
      result
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error
    })
  }
}

export const loginController = async (req: Request, res: Response) => {
  const { user }: any = req
  const userId = user._id
  try {
    const result = await usersService.login(userId.toString())
    res.status(201).json({
      message: 'User login successfully',
      result,
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error login user',
      error
    })
  }
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequest>, res: Response) => {
  const { refreshToken } = req.body
  usersService.logout(refreshToken)
  res.status(201).json({
    message: 'User logout successfully'
  })
}
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error
    })
  }
}
