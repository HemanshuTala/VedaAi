import mongoose from 'mongoose'

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/veda-ai'
  
  try {
    await mongoose.connect(mongoUri)
    console.log('MongoDB connection established')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed through app termination')
  process.exit(0)
})
