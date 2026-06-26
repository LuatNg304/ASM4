import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ErrorWithStatus } from '~/models/schemas/ErrorWithStatus'
import questionSchema from '~/models/schemas/question.schema'
import userSchema from '~/models/schemas/user.schema'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validations'

export const verifyAdmin = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: {
          errorMessage: 'Access token is required'
        },
        custom: {
          options: async (value: string) => {
            const [, access_token] = value.split(' ')
            if (!access_token) {
              throw new Error('Access token is required')
            }
            try {
              const decoded = await verifyToken({
                token: access_token
              })
              const user = await userSchema.findOne({
                _id: decoded.userId,
                admin: true
              })
              if (!user) {
                throw new ErrorWithStatus({
                  message: 'You are not authorized to perform this operation!',
                  status: 403
                })
              }
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Access token is invalid',
                  status: 401
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['headers']
  )
)
