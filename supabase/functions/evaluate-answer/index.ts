import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question, answer, questionType, technologyStack } = await req.json()

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are an expert interviewer evaluating a candidate's answer for a ${technologyStack} position.

Question Type: ${questionType}
Question: "${question}"
Candidate's Answer: "${answer}"

Please evaluate this answer and provide:
1. A score from 0-100 based on:
   - Technical accuracy (for technical questions)
   - Relevance and completeness
   - Communication clarity
   - Problem-solving approach
   - Professional experience demonstrated

2. Constructive feedback (2-3 sentences) highlighting:
   - What was good about the answer
   - Areas for improvement
   - Specific suggestions

Return the response as JSON with this exact format:
{
  "score": 85,
  "feedback": "Good understanding of the concept. Could provide more specific examples and implementation details."
}

Be fair but thorough in your evaluation. Consider the question type and technology stack context.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini')
    }

    const evaluation = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify(evaluation),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
}) 