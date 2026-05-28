import { Queue, Worker, Job } from 'bullmq'
import { Server as SocketIOServer } from 'socket.io'
import Assignment from '../models/Assignment'
import { generateQuestions } from '../services/aiService'

let queue: Queue | null = null
let worker: Worker | null = null

export async function setupQueue(io: SocketIOServer) {
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  const parsedUrl = new URL(redisUrl)
  const connection = {
    host: parsedUrl.hostname || '127.0.0.1',
    port: parsedUrl.port ? parseInt(parsedUrl.port) : 6379,
    username: parsedUrl.username || undefined,
    password: parsedUrl.password || undefined,
  }

  // Create queue
  queue = new Queue('question-generation', {
    connection,
  })

  // Create worker
  worker = new Worker(
    'question-generation',
    async (job: Job) => {
      const { jobId, assignmentId } = job.data

      try {
        // Update status to processing
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' })
        
        // Emit progress
        io.to(jobId).emit('job-status', {
          status: 'processing',
          progress: 10,
        })

        // Fetch assignment
        const assignment = await Assignment.findById(assignmentId)
        if (!assignment) {
          throw new Error('Assignment not found')
        }

        // Emit progress
        io.to(jobId).emit('job-status', {
          status: 'processing',
          progress: 30,
        })

        // Generate questions using AI
        const sections = await generateQuestions(assignment)

        // Emit progress
        io.to(jobId).emit('job-status', {
          status: 'processing',
          progress: 70,
        })

        // Update assignment with generated sections
        assignment.sections = sections
        assignment.status = 'completed'
        await assignment.save()

        // Emit completion
        io.to(jobId).emit('job-status', {
          status: 'completed',
          progress: 100,
          result: assignment,
        })

        return { success: true, assignment }
      } catch (error) {
        console.error('Job processing error:', error)
        
        // Update status to failed
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' })
        
        // Emit error
        io.to(jobId).emit('job-status', {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        })

        throw error
      }
    },
    {
      connection,
    }
  )

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err)
  })

  return queue
}

export async function addJobToQueue(jobId: string, assignmentId: string) {
  if (!queue) {
    throw new Error('Queue not initialized')
  }

  await queue.add('generate-questions', {
    jobId,
    assignmentId,
  })
}
