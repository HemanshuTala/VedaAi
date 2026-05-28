import { create } from 'zustand'

export interface Assignment {
  title: string
  subject: string
  dueDate: string
  questionTypes: string[]
  totalQuestions: number
  totalMarks: number
  instructions?: string
  difficulty: string
}

export interface QuestionPaper {
  id: string
  assignment: Assignment
  sections: Section[]
  createdAt: string
}

export interface Section {
  id: string
  title: string
  instruction: string
  questions: Question[]
}

export interface Question {
  id: string
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  marks: number
  type: string
}

interface AssignmentStore {
  assignment: Assignment | null
  jobId: string | null
  questionPaper: QuestionPaper | null
  setAssignment: (assignment: Assignment) => void
  setJobId: (jobId: string) => void
  setQuestionPaper: (questionPaper: QuestionPaper) => void
  clearStore: () => void
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignment: null,
  jobId: null,
  questionPaper: null,
  setAssignment: (assignment) => set({ assignment }),
  setJobId: (jobId) => set({ jobId }),
  setQuestionPaper: (questionPaper) => set({ questionPaper }),
  clearStore: () => set({ assignment: null, jobId: null, questionPaper: null }),
}))
