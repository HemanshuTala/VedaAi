import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { connectDatabase } from './config/database'
import { connectRedis } from './config/redis'
import { setupQueue } from './queue/setup'
import assignmentRoutes from './routes/assignment'
import { setupWebSocket } from './websocket'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/assignments', assignmentRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Initialize services
async function initializeServer() {
  try {
    // Connect to MongoDB
    await connectDatabase()
    console.log('✅ MongoDB connected')

    // Connect to Redis
    await connectRedis()
    console.log('✅ Redis connected')

    // Setup BullMQ
    await setupQueue(io)
    console.log('✅ BullMQ queue setup complete')

    // Setup WebSocket
    setupWebSocket(io)
    console.log('✅ WebSocket server setup complete')

    const PORT = process.env.PORT || 5000
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to initialize server:', error)
    process.exit(1)
  }
}

initializeServer()
