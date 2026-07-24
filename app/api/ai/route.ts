import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    console.log('AI API: Received request')
    
    const body = await request.json()
    const { query, context } = body

    console.log('AI API: Query:', query)
    console.log('AI API: Context mode:', context?.mode)

    if (!query) {
      console.log('AI API: No query provided')
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Validate context
    const validatedContext = {
      currentSkins: context?.currentSkins || [],
      userPreferences: context?.userPreferences || {},
      chatHistory: context?.chatHistory || [],
      mode: context?.mode || 'chat'
    }

    console.log('AI API: Calling aiService.generateResponse')
    
    // Generate AI response
    const aiResponse = await aiService.generateResponse(query, validatedContext)

    console.log('AI API: Success, returning response')
    
    return NextResponse.json({
      success: true,
      data: aiResponse
    })

  } catch (error) {
    console.error('AI API Error:', error)
    console.error('AI API Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate AI response',
        fallback: true,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Rate limiting middleware
export async function GET() {
  const provider =
    process.env.AI_PROVIDER ||
    process.env.NEXT_PUBLIC_AI_PROVIDER ||
    "openrouter"

  return NextResponse.json({
    status: "AI API is running",
    provider,
    providers: ["openrouter", "ollama", "openai", "gemini"],
    features: ["Chat", "Analysis", "Generator"],
    openrouter: {
      defaultUrl: "https://openrouter.ai/api/v1/chat/completions",
      defaultModel: "nvidia/nemotron-3-ultra-550b-a55b:free",
      setup:
        "Create a key at https://openrouter.ai/keys, set AI_PROVIDER=openrouter and AI_API_KEY",
    },
    ollama: {
      defaultUrl: "http://localhost:11434/v1/chat/completions",
      defaultModel: "llama3.2",
      setup: "Install Ollama, run `ollama pull llama3.2`, set AI_PROVIDER=ollama",
    },
  })
}
