// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateConfig, config } from "@/lib/config";
import { openRouterClient, rateLimiter } from "@/lib/api-clients";

try {
  validateConfig();
} catch (error) {
  console.error("Configuration validation failed:", error);
}

export async function POST(request: NextRequest) {
  try {
    console.log("Guidance generation API called");

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (
      !rateLimiter.isAllowed(`generate:${clientIp}`, config.rateLimit.guidance)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt too short. Please provide more details.",
        },
        { status: 400 }
      );
    }

    console.log("Generating guidance for:", prompt);

    if (!config.openrouter.apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "API key not configured. Please add your OpenRouter API key.",
        },
        { status: 503 }
      );
    }

    try {
      const guidanceResult = await generateGuidanceWithAI(prompt);
      console.log("AI guidance generation successful");

      return NextResponse.json({
        success: true,
        data: guidanceResult,
      });
    } catch (error) {
      console.error("OpenRouter API failed:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to generate guidance. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Guidance generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate guidance",
      },
      { status: 500 }
    );
  }
}

async function generateGuidanceWithAI(prompt: string): Promise<any> {
  const systemPrompt = `You are an expert programming mentor and career advisor. The user asked: "${prompt}"

Provide COMPREHENSIVE, PERSONALIZED guidance that directly answers their question. If they ask about learning paths, provide a real roadmap. If they ask about concepts, explain them thoroughly with examples.

Return ONLY valid JSON with this structure:

{
  "title": "Engaging title that addresses their question",
  "overview": "2-3 sentence summary that directly answers their query",
  "category": "concept|career|tutorial|best-practices",
  "difficulty": "beginner|intermediate|advanced",
  "estimatedTime": "Realistic time needed",
  "prerequisites": ["What they should know before starting"],
  "learningObjectives": ["What they will achieve"],
  "stepByStepGuide": [
    {
      "step": 1,
      "title": "Clear step title",
      "description": "Detailed, actionable instructions",
      "codeExample": "RELEVANT code examples that demonstrate the concept",
      "tips": ["Practical advice", "Common pitfalls to avoid"]
    }
  ],
  "completeExample": {
    "title": "Practical example title",
    "description": "How this applies in real world",
    "code": "COMPLETE working code that demonstrates the concept"
  },
  "bestPractices": [
    {
      "practice": "Specific best practice",
      "reason": "Why it matters for their goal"
    }
  ],
  "nextSteps": [
    {
      "step": "Concrete next action",
      "reason": "Why this is important"
    }
  ]
}

IMPORTANT: 
- Make it PERSONALIZED to their query: "${prompt}"
- Provide ACTUAL educational content, not just structure
- Include REAL code examples when relevant
- Give PRACTICAL advice they can use immediately
- If it's a career question, provide real career guidance
- If it's a concept question, explain it thoroughly`;

  const response = await openRouterClient.generateCompletion(
    systemPrompt,
    config.openrouter.models.smart
  );

  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : response.trim();

  try {
    const parsed = JSON.parse(jsonString);

    return {
      type: "guidance",
      content: parsed,
      generatedAt: new Date().toISOString(),
      query: prompt,
    };
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);

    // Even if parsing fails, return a meaningful response
    return {
      type: "guidance",
      content: {
        title: `Guidance for: ${prompt}`,
        overview: "Here's comprehensive guidance based on your question...",
        category: "tutorial",
        difficulty: "beginner",
        estimatedTime: "Varies",
        prerequisites: ["Basic computer knowledge"],
        learningObjectives: [
          "Understand the core concepts",
          "Apply the knowledge",
        ],
        stepByStepGuide: [
          {
            step: 1,
            title: "Understanding Your Question",
            description: `Based on your query "${prompt}", let me provide you with comprehensive guidance...`,
            codeExample: "// Relevant code examples would be here",
            tips: ["Start with the basics", "Practice regularly"],
          },
        ],
        completeExample: {
          title: "Practical Implementation",
          description: "Here's how you can apply this knowledge",
          code: "// Complete working example",
        },
        bestPractices: [
          {
            practice: "Learn by doing",
            reason: "Practical experience is the best teacher",
          },
        ],
        nextSteps: [
          {
            step: "Continue practicing",
            reason: "Consistency leads to mastery",
          },
        ],
      },
      generatedAt: new Date().toISOString(),
      query: prompt,
    };
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST to generate guidance.",
      usage: {
        method: "POST",
        endpoint: "/api/generate",
        body: {
          prompt: "Your question about programming, career, or learning",
        },
      },
    },
    { status: 405 }
  );
}
