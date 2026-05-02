import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ── Resume Generation ──────────────────────────────────────────────────────────

export interface ResumeInput {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  summary?: string
  experience: {
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    responsibilities: string
  }[]
  education: {
    degree: string
    institution: string
    location: string
    graduationYear: string
    achievements?: string
  }[]
  skills: string
  targetRole?: string
  targetJobDescription?: string
}

export async function generateResume(input: ResumeInput): Promise<string> {
  const prompt = `You are an expert CV writer specializing in ATS-optimized resumes for the East African job market. 

Generate a professional, ATS-friendly resume for the following candidate. Return the resume as structured JSON.

Candidate Information:
- Name: ${input.fullName}
- Email: ${input.email}
- Phone: ${input.phone}
- Location: ${input.location}
${input.linkedin ? `- LinkedIn: ${input.linkedin}` : ''}
${input.targetRole ? `- Target Role: ${input.targetRole}` : ''}

Experience:
${input.experience.map((e) => `
  Role: ${e.title} at ${e.company} (${e.startDate} - ${e.endDate})
  Location: ${e.location}
  Responsibilities: ${e.responsibilities}
`).join('\n')}

Education:
${input.education.map((e) => `
  ${e.degree} — ${e.institution} (${e.graduationYear})
  ${e.achievements ? `Achievements: ${e.achievements}` : ''}
`).join('\n')}

Skills: ${input.skills}
${input.summary ? `Current Summary: ${input.summary}` : ''}
${input.targetJobDescription ? `Target Job Description: ${input.targetJobDescription}` : ''}

Instructions:
1. Write a compelling professional summary (3-4 sentences) that highlights key value proposition
2. Rewrite each experience bullet point as a strong achievement using action verbs and quantified results where possible
3. Add 3-5 ATS-optimized bullet points per role
4. Extract and organize skills into categories (Technical, Soft Skills, Tools)
5. Tailor everything to the target role if provided

Return ONLY valid JSON in this exact format:
{
  "professionalSummary": "string",
  "experience": [
    {
      "title": "string",
      "company": "string", 
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "bullets": ["string", "string", "string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "location": "string",
      "graduationYear": "string",
      "achievements": "string"
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "tools": ["string"]
  }
}`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return text
}

// ── Cover Letter Generation ────────────────────────────────────────────────────

export interface CoverLetterInput {
  candidateName: string
  candidateEmail: string
  jobTitle: string
  companyName: string
  jobDescription: string
  resumeSummary: string
  keyExperience: string
}

export async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  const prompt = `You are an expert career coach writing cover letters for East African professionals.

Write a compelling, professional cover letter for:
- Candidate: ${input.candidateName}
- Applying for: ${input.jobTitle} at ${input.companyName}

Job Description:
${input.jobDescription}

Candidate's Profile:
Summary: ${input.resumeSummary}
Key Experience: ${input.keyExperience}

Instructions:
1. Write in a confident, professional tone — not overly formal
2. Open with a strong hook that shows genuine interest in this specific role
3. In the body, connect 2-3 specific achievements to the job requirements
4. Close with a clear call to action
5. Keep it to 3 paragraphs, under 300 words
6. Do NOT use clichés like "I am writing to apply..." or "To whom it may concern"

Return ONLY the cover letter text, no JSON, no extra formatting.`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return text
}

// ── Job Description Analyzer ───────────────────────────────────────────────────

export interface JDAnalysis {
  jobTitle: string
  hardSkills: string[]
  softSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  keywords: string[]
  experienceLevel: string
  companyCulture: string
}

export async function analyzeJobDescription(jd: string): Promise<JDAnalysis> {
  const prompt = `You are an expert ATS and recruitment analyst. Analyze the following job description and extract key information to help a candidate optimize their application.

Job Description:
${jd}

Return ONLY valid JSON in this exact format:
{
  "jobTitle": "string",
  "hardSkills": ["string"],
  "softSkills": ["string"],
  "responsibilities": ["string"],
  "qualifications": ["string"],
  "keywords": ["string - top 10 keywords to include in CV"],
  "experienceLevel": "string (e.g. Entry Level, Mid Level, Senior)",
  "companyCulture": "string (brief 1-sentence insight)"
}`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as JDAnalysis
}

// ── CV Review / AI Feedback ────────────────────────────────────────────────────

export interface CVFeedback {
  overallScore: number
  atsScore: number
  strengths: string[]
  improvements: string[]
  missingKeywords: string[]
  suggestion: string
}

export async function reviewCV(cvText: string, targetRole?: string): Promise<CVFeedback> {
  const prompt = `You are a senior HR professional and ATS expert reviewing a CV${targetRole ? ` for a ${targetRole} position` : ''}.

CV Content:
${cvText}

Provide honest, actionable feedback. Return ONLY valid JSON:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "missingKeywords": ["string", "string"],
  "suggestion": "string (one most impactful change, 1-2 sentences)"
}`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as CVFeedback
}

// ── Magic Rewrite ─────────────────────────────────────────────────────────────

export async function rewriteBullets(text: string): Promise<string> {
  const prompt = `You are an expert CV writer. Rewrite the following responsibilities or bullet points into highly professional, achievement-oriented, ATS-friendly bullet points.
Use action verbs and quantify results if the user provided metrics. Keep it concise but powerful.

Text to rewrite:
${text}

Return ONLY the rewritten text as a bulleted list (using standard dash "-" for bullets). Do not include any introductions, explanations, or JSON formatting.`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

// ── LinkedIn Profile Importer ──────────────────────────────────────────────────

export interface ExtractedProfile {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  summary: string
  experience: {
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    responsibilities: string
  }[]
  education: {
    degree: string
    institution: string
    location: string
    graduationYear: string
    achievements: string
  }[]
  skills: string
}

export async function importLinkedIn(pdfText: string): Promise<ExtractedProfile> {
  const prompt = `You are a data extraction AI. Extract the candidate's profile information from the following LinkedIn profile PDF text and map it exactly to the JSON structure provided.

Profile Text:
${pdfText.substring(0, 15000)}

Extract all recent experience and education. Format dates cleanly (e.g. "Jan 2020", "Present").
Return ONLY valid JSON in this exact format. Do not use markdown backticks in the response.
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "summary": "string",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "responsibilities": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "location": "string",
      "graduationYear": "string",
      "achievements": "string"
    }
  ],
  "skills": "string (comma separated list of top 10-15 skills)"
}`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as ExtractedProfile
}

// ── AI Mock Interviewer ────────────────────────────────────────────────────────

export interface InterviewQA {
  question: string
  context: string
  tips: string[]
}

export async function generateInterview(resumeJson: any, jd: string): Promise<InterviewQA[]> {
  const prompt = `You are an expert technical recruiter and hiring manager conducting an interview for this specific role.

Job Description:
${jd || 'General Role'}

Candidate's Resume:
${JSON.stringify(resumeJson)}

Based on the candidate's experience and the job description, generate the 5 most likely interview questions they will be asked. Focus on their specific experience gaps, their achievements, and the core skills needed for the role.

Return ONLY valid JSON in this exact format. Do not use markdown backticks in the response.
[
  {
    "question": "The interview question",
    "context": "Why the interviewer is asking this based on their CV or the JD",
    "tips": ["Tip 1 on how to answer", "Tip 2", "Tip 3"]
  }
]`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'
  const clean = text.replace(/```json|```/g, '').trim()
}

// ── Career Roadmap Generator ───────────────────────────────────────────────────

export interface RoadmapData {
  dreamRole: string
  missingSkills: string[]
  recommendedCertifications: string[]
  month1to2: string[]
  month3to4: string[]
  month5to6: string[]
}

export async function generateRoadmap(resumeJson: any, dreamRole: string): Promise<RoadmapData> {
  const prompt = `You are an elite career coach. Analyze the candidate's current CV and their Dream Role, then generate a practical 6-month roadmap to help them bridge the gap.

Candidate's Current CV:
${JSON.stringify(resumeJson)}

Dream Role: ${dreamRole}

Identify what skills they are missing, recommend specific certifications or courses, and break down the actionable steps into three 2-month phases. Keep points concise and actionable.

Return ONLY valid JSON in this exact format. Do not use markdown backticks in the response.
{
  "dreamRole": "string",
  "missingSkills": ["skill 1", "skill 2"],
  "recommendedCertifications": ["cert 1", "cert 2"],
  "month1to2": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "month3to4": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "month5to6": ["actionable step 1", "actionable step 2", "actionable step 3"]
}`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as RoadmapData
}
