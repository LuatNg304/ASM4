import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb+srv://luatluat3042_db_user:Gialuat2003@cluster0.62zo9p9.mongodb.net/SimpleQuiz');

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}
