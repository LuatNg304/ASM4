import express from 'express'

import dotenv from 'dotenv'
import { connectDB } from './config/database.config'
import quizzesRouter from './routes/quizzes.routes'
import questionsRouter from './routes/questions.routes'
import usersRouter from './routes/users.routes'

dotenv.config()
connectDB()
const app = express()
const port = 3000

// Enable CORS middleware natively to allow requests from the React frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json()) //dung de parse json tu client gui len

app.use(express.urlencoded({ extended: true })); // Để đọc dữ liệu từ Form HTML (Sử dụng trường này nếu dùng Form)
app.use('/quizzes', quizzesRouter)
app.use('/api/quizzes', quizzesRouter)
app.use('/questions', questionsRouter)
app.use('/api/questions', questionsRouter)
app.use('/users', usersRouter)
app.use('/api/users', usersRouter)

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export default app

