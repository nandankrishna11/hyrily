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
    const { technologyStack, questionCount = 12 } = await req.json()

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Add a randomizer to the prompt for more variety
    const randomizer = Math.floor(Math.random() * 1000000);
    const prompt = `Generate ${questionCount} interview questions for a ${technologyStack} position. 
    The questions should be a mix of different types:
    - 4 technical questions (specific to ${technologyStack})
    - 4 behavioral questions (soft skills, teamwork, problem-solving)
    - 2 problem-solving questions (algorithmic thinking, debugging)
    - 2 system design questions (architecture, scalability)

    For each question, provide:
    - type: "technical", "behavioral", "problem-solving", or "system-design"
    - question: the actual question text

    Return the response as a JSON array with this exact format:
    [
      {
        "type": "technical",
        "question": "What is the difference between REST and GraphQL APIs?"
      }
    ]

    Make sure the questions are relevant to ${technologyStack} and appropriate for a professional interview.
    Add some randomness so that each call produces a different set of questions, even for the same stack. Randomizer: ${randomizer}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini')
    }

    const questions = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify({ questions }),
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