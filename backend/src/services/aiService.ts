import OpenAI from 'openai'
import Assignment, { ISection } from '../models/Assignment'

let openai: OpenAI | null = null

export async function generateQuestions(assignment: any): Promise<ISection[]> {
  if (!openai) {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_sdk_crash';
    const baseURL = process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : undefined;
    openai = new OpenAI({
      apiKey,
      baseURL,
    })
  }

  const {
    subject,
    totalQuestions,
    totalMarks,
    questionTypes,
    difficulty,
    instructions,
    referenceText,
  } = assignment

  // Calculate questions per section
  const sectionsCount = Math.min(questionTypes.length, 3)
  const questionsPerSection = Math.ceil(totalQuestions / sectionsCount)
  const marksPerQuestion = Math.ceil(totalMarks / totalQuestions)

  // Build prompt
  const prompt = `You are an expert teacher creating a question paper for ${subject}. 

Generate ${totalQuestions} questions with a total of ${totalMarks} marks.

Requirements:
- Difficulty level: ${difficulty}
- Question types: ${questionTypes.join(', ')}
- Total questions: ${totalQuestions}
- Total marks: ${totalMarks}
${instructions ? `Additional instructions: ${instructions}` : ''}
${referenceText ? `Use the following reference material to base your questions on:\n${referenceText}` : ''}

Generate the response in the following JSON format:
{
  "sections": [
    {
      "id": "section-a",
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "id": "q1",
          "text": "Question text here",
          "difficulty": "easy|medium|hard",
          "marks": ${marksPerQuestion},
          "type": "${questionTypes[0]}"
        }
      ]
    }
  ]
}

Important:
- Distribute questions across ${sectionsCount} sections
- Mix difficulty levels appropriately
- Ensure questions are relevant to ${subject}
- Return ONLY valid JSON, no additional text
- Each section should have roughly ${questionsPerSection} questions`

  try {
    const model = process.env.GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4';
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Parse JSON response
    const parsed = JSON.parse(response)
    
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid response format from AI')
    }

    // Validate and format sections
    const sections: ISection[] = parsed.sections.map((section: any, index: number) => ({
      id: section.id || `section-${index}`,
      title: section.title || `Section ${String.fromCharCode(65 + index)}`,
      instruction: section.instruction || 'Attempt all questions',
      questions: section.questions.map((q: any, qIndex: number) => ({
        id: q.id || `q-${index}-${qIndex}`,
        text: q.text || 'Question text',
        difficulty: q.difficulty || 'medium',
        marks: q.marks || marksPerQuestion,
        type: q.type || questionTypes[0],
      })),
    }))

    return sections
  } catch (error) {
    console.error('AI generation error:', error)
    
    // Fallback to mock data if AI fails
    return generateMockQuestions(assignment)
  }
}

function generateMockQuestions(assignment: any): ISection[] {
  const { subject, totalQuestions, totalMarks, questionTypes, difficulty } = assignment
  const sectionsCount = Math.min(questionTypes.length, 3)
  const questionsPerSection = Math.ceil(totalQuestions / sectionsCount)
  const marksPerQuestion = Math.ceil(totalMarks / totalQuestions)

  const sections: ISection[] = []

  for (let i = 0; i < sectionsCount; i++) {
    const questions = []
    for (let j = 0; j < questionsPerSection && questions.length < totalQuestions; j++) {
      const difficulties = ['easy', 'medium', 'hard']
      const randomDifficulty = difficulty === 'mixed' 
        ? difficulties[Math.floor(Math.random() * difficulties.length)]
        : difficulty

      questions.push({
        id: `q-${i}-${j}`,
        text: `Sample ${questionTypes[i]} question ${j + 1} for ${subject}`,
        difficulty: randomDifficulty as 'easy' | 'medium' | 'hard',
        marks: marksPerQuestion,
        type: questionTypes[i],
      })
    }

    sections.push({
      id: `section-${i}`,
      title: `Section ${String.fromCharCode(65 + i)}`,
      instruction: 'Attempt all questions',
      questions,
    })
  }

  return sections
}
