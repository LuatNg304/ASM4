import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ErrorWithStatus } from '~/models/schemas/ErrorWithStatus'
import questionSchema from '~/models/schemas/question.schema'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validations'

export const vertifyAuthor = validate(
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
            try {
              const decoded_authenrization = await verifyToken({ token: access_token })
              const user_id = decoded_authenrization.userId
              const question_id = (req as Request).params.id
              const question = await questionSchema.findById(question_id)
              if (!question) {
                throw new Error('Question not found')
              }
              if (question.author.toString() !== user_id) {
                throw new Error('You are not the author of this question')
              }
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Access token is invalid',
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
    ['headers']
  )
)
