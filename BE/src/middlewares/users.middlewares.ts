import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ErrorWithStatus } from '~/models/schemas/ErrorWithStatus'
import refreshTokenSchema from '~/models/schemas/refreshToken.schema'
import userSchema from '~/models/schemas/user.schema'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validations'

export const registerValidation = validate(
  checkSchema({
    username: {
      in: ['body'],
      isLength: {
        options: { min: 3 },
        errorMessage: 'Username must be at least 3 characters long'
      },
      isString: true,
      notEmpty: true,
      errorMessage: 'Username is required and must be a string',
      trim: true,
      custom: {
        options: async (value) => {
          const existingUser = await usersService.findByUsername(value)
          if (existingUser) {
            throw new Error('Username already exists')
          }
        }
      }
    },
    password: {
      in: ['body'],
      isLength: {
        options: { min: 8 },
        errorMessage: 'Password must be at least 8 characters long'
      },
      isString: true,
      notEmpty: true,
      errorMessage: 'Password is required and must be a string',
      trim: true
    },
    confirmPassword: {
      in: ['body'],
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password must match password')
          }
          return true
        }
      },
      isString: true,
      notEmpty: true,
      errorMessage: 'Confirm password is required and must be a string',
      trim: true
    }
  })
)
export const loginValidator = validate(
  checkSchema({
    username: {
      in: ['body'],
      isLength: {
        options: { min: 3 },
        errorMessage: 'Username must be at least 3 characters long'
      },
      isString: true,
      notEmpty: true,
      errorMessage: 'Username is required and must be a string',
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await userSchema.findOne({ username: value, password: hashPassword(req.body.password) })
          if (user === null) {
            throw new Error('User not found!!!!')
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      in: ['body'],
      isLength: {
        options: { min: 8 },
        errorMessage: 'Password must be at least 8 characters long'
      },
      isString: true,
      notEmpty: true,
      errorMessage: 'Password is required and must be a string',
      trim: true
    }
  })
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: {
          errorMessage: 'Access token is required'
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new Error('Access token is required')
            }
            const decoded_authenrization = await verifyToken({ token: access_token })
            ;(req as Request).decoded_authenrization = decoded_authenrization
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: {
          errorMessage: 'Refresh token is required'
        },
        isString: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            try {
              const [decoded_refresh_token, refreshToken] = await Promise.all([
                verifyToken({ token: value }),
                refreshTokenSchema.findOne({ token: value })
              ])
              if (!refreshToken) {
                throw new Error('Refresh token is not found')
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Refresh token is invalid',
                  status: 401
                })
              } else {
                throw error
              }
            }
          }
        }
      }
    },
    ['body']
  )
)
