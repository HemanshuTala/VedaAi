import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import multer from 'multer'
import Assignment from '../models/Assignment'
import { addJobToQueue } from '../queue/setup'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// POST /api/assignments - Create new assignment
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      subject,
      dueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      instructions,
      difficulty,
    } = req.body

    // Validate required fields
    if (!title || !subject || !dueDate || !questionTypes || !totalQuestions || !totalMarks || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Parse questionTypes if it is a stringified JSON array
    let parsedQuestionTypes: string[] = []
    if (typeof questionTypes === 'string') {
      try {
        parsedQuestionTypes = JSON.parse(questionTypes)
      } catch (e) {
        parsedQuestionTypes = [questionTypes]
      }
    } else {
      parsedQuestionTypes = questionTypes
    }

    const numQuestions = Number(totalQuestions)
    const numMarks = Number(totalMarks)

    // Handle reference file if uploaded
    let referenceText = ''
    if (req.file) {
      if (req.file.mimetype === 'text/plain') {
        referenceText = req.file.buffer.toString('utf-8')
      } else {
        // PDF or other binary file - pull readable ASCII text
        referenceText = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      }
    }

    const jobId = uuidv4()

    // Create assignment
    const assignment = new Assignment({
      title,
      subject,
      dueDate: new Date(dueDate),
      questionTypes: parsedQuestionTypes,
      totalQuestions: numQuestions,
      totalMarks: numMarks,
      instructions,
      difficulty,
      referenceText: referenceText || undefined,
      jobId,
      status: 'queued',
    })

    await assignment.save()

    // Add job to queue
    await addJobToQueue(jobId, assignment._id.toString())

    res.json({ jobId, assignmentId: assignment._id })
  } catch (error) {
    console.error('Error creating assignment:', error)
    res.status(500).json({ error: 'Failed to create assignment' })
  }
})

// POST /api/assignments/:jobId/regenerate - Regenerate question paper
router.post('/:jobId/regenerate', async (req, res) => {
  try {
    const { jobId } = req.params

    // Find assignment by jobId
    const assignment = await Assignment.findOne({ jobId })

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    // Update status
    assignment.status = 'queued'
    assignment.sections = undefined
    await assignment.save()

    // Add job to queue again
    await addJobToQueue(jobId, assignment._id.toString())

    res.json({ success: true })
  } catch (error) {
    console.error('Error regenerating assignment:', error)
    res.status(500).json({ error: 'Failed to regenerate assignment' })
  }
})

// GET /api/assignments/job/:jobId - Get assignment by Job ID
router.get('/job/:jobId', async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ jobId: req.params.jobId })

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    res.json(assignment)
  } catch (error) {
    console.error('Error fetching assignment by jobId:', error)
    res.status(500).json({ error: 'Failed to fetch assignment' })
  }
})

// GET /api/assignments/:id - Get assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    res.json(assignment)
  } catch (error) {
    console.error('Error fetching assignment:', error)
    res.status(500).json({ error: 'Failed to fetch assignment' })
  }
})

// GET /api/assignments - Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 })
    res.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    res.status(500).json({ error: 'Failed to fetch assignments' })
  }
})

// DELETE /api/assignments/:id - Delete assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id)
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' })
    }
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting assignment:', error)
    res.status(500).json({ error: 'Failed to delete assignment' })
  }
})

export default router
