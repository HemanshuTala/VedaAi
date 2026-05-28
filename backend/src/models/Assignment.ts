import mongoose, { Document, Schema } from 'mongoose'

export interface IQuestion {
  id: string
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  marks: number
  type: string
}

export interface ISection {
  id: string
  title: string
  instruction: string
  questions: IQuestion[]
}

export interface IAssignment {
  title: string
  subject: string
  dueDate: Date
  questionTypes: string[]
  totalQuestions: number
  totalMarks: number
  instructions?: string
  difficulty: string
  fileUrl?: string
  referenceText?: string
  jobId?: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  sections?: ISection[]
  createdAt: Date
  updatedAt: Date
}

export interface IAssignmentDocument extends IAssignment, Document {}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  marks: { type: Number, required: true },
  type: { type: String, required: true },
})

const SectionSchema = new Schema<ISection>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
})

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questionTypes: [{ type: String, required: true }],
    totalQuestions: { type: Number, required: true, min: 1, max: 50 },
    totalMarks: { type: Number, required: true, min: 1, max: 1000 },
    instructions: { type: String },
    difficulty: { type: String, required: true },
    fileUrl: { type: String },
    referenceText: { type: String },
    jobId: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    sections: [SectionSchema],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IAssignmentDocument>('Assignment', AssignmentSchema)
