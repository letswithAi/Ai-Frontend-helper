// app/api/vision/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateConfig, config } from "@/lib/config";
import { openRouterClient, rateLimiter } from "@/lib/api-clients";
import { VisionResponse } from "@/lib/types";

try {
  validateConfig();
} catch (error) {
  console.error("Configuration validation failed:", error);
}

export async function POST(request: NextRequest) {
  try {
    console.log("Vision analysis API called");

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimiter.isAllowed(`vision:${clientIp}`, config.rateLimit.vision)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const userPrompt = (formData.get("prompt") as string) || "";

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Supported: PNG, JPEG, JPG, WEBP",
        },
        { status: 400 }
      );
    }

    if (image.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = image.type;

    let analysisResult;

    if (config.openrouter.apiKey) {
      try {
        analysisResult = await analyzeImageWithAI(
          base64Image,
          mimeType,
          userPrompt
        );
        console.log("AI image analysis successful");
      } catch (error) {
        console.warn("OpenRouter API failed, using fallback:", error);
        analysisResult = generateImageAnalysisFallback(image.name, userPrompt);
      }
    } else {
      console.log("Using fallback (no API key)");
      analysisResult = generateImageAnalysisFallback(image.name, userPrompt);
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Vision analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to analyze image",
      },
      { status: 500 }
    );
  }
}

async function analyzeImageWithAI(
  base64Image: string,
  mimeType: string,
  userPrompt: string
): Promise<any> {
  const systemPrompt = `You are an expert UI/UX analyst and web developer. Analyze the UI design image and provide a professional project structure.

${
  userPrompt
    ? `User's specific request: ${userPrompt}`
    : "Analyze the UI design in this image."
}

Return a detailed JSON response with this EXACT structure:
{
  "description": "Detailed description of the UI design, layout, colors, typography, and components visible",
  "pageType": "Type of page (e.g., Landing Page, Dashboard, Login Form, E-commerce, etc.)",
  "uiElements": ["List of UI elements identified: buttons, forms, cards, navigation, etc."],
  "folderStructure": [
    "src/",
    "├── components/",
    "│   ├── ui/",
    "│   ├── layout/",
    "│   └── forms/",
    "├── pages/",
    "├── styles/",
    "├── utils/",
    "├── hooks/",
    "├── lib/",
    "├── types/",
    "└── assets/"
  ],
  "filesList": [
    {
      "path": "src/components/ui/Button.tsx",
      "purpose": "Reusable button component with variants"
    },
    {
      "path": "src/components/layout/Header.tsx",
      "purpose": "Main header/navigation component"
    },
    {
      "path": "src/pages/index.tsx",
      "purpose": "Main landing page"
    }
  ],
  "recommendedTech": {
    "frontend": ["React", "Next.js 14", "TypeScript"],
    "styling": ["Tailwind CSS", "Material-UI"],
    "stateManagement": ["React Context", "Zustand"],
    "backend": ["Node.js", "Express", "Next.js API Routes"],
    "database": ["PostgreSQL", "MongoDB"]
  },
  "stepByStepGuide": [
    {
      "step": 1,
      "title": "Project Setup",
      "description": "Initialize Next.js project with TypeScript",
      "commands": ["npx create-next-app@latest my-app --typescript"],
      "details": "Set up the base project structure"
    },
    {
      "step": 2,
      "title": "Install Dependencies",
      "description": "Install required packages",
      "commands": ["npm install @mui/material @emotion/react tailwindcss"],
      "details": "Install UI libraries and styling frameworks"
    }
  ],
  "components": [
    {
      "name": "Header",
      "purpose": "Navigation and branding",
      "props": ["logo", "menuItems", "user"],
      "complexity": "medium"
    }
  ],
  "colorPalette": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "designPatterns": ["Responsive Grid", "Card Layout", "Form Validation"],
  "accessibility": ["ARIA labels", "Keyboard navigation", "Color contrast"],
  "responsiveBreakpoints": {
    "mobile": "640px",
    "tablet": "768px",
    "desktop": "1024px"
  }
}`;

  const response = await openRouterClient.generateCompletion(
    `${systemPrompt}\n\nImage: data:${mimeType};base64,${base64Image}`,
    config.openrouter.models.smart
  );

  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : response;

  try {
    const parsed = JSON.parse(jsonString);
    return {
      success: true,
      description: parsed.description || "Image analysis completed",
      pageType: parsed.pageType || "UI Design",
      uiElements: parsed.uiElements || [],
      folderStructure: parsed.folderStructure || [],
      filesList: parsed.filesList || [],
      recommendedTech: parsed.recommendedTech || {},
      stepByStepGuide: parsed.stepByStepGuide || [],
      components: parsed.components || [],
      colorPalette: parsed.colorPalette || {},
      designPatterns: parsed.designPatterns || [],
      accessibility: parsed.accessibility || [],
      responsiveBreakpoints: parsed.responsiveBreakpoints || {},
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Invalid JSON response from AI");
  }
}

function generateImageAnalysisFallback(
  fileName: string,
  userPrompt: string
): any {
  return {
    success: true,
    description: `Image uploaded: ${fileName}. ${
      userPrompt ? `User request: ${userPrompt}. ` : ""
    }Please describe the UI design for detailed analysis.`,
    pageType: "UI Design",
    uiElements: ["Please describe the UI elements you see"],
    folderStructure: ["src/", "├── components/", "├── pages/", "├── styles/"],
    filesList: [],
    recommendedTech: { frontend: ["React", "TypeScript"], styling: ["CSS"] },
    stepByStepGuide: [],
    components: [],
    colorPalette: {},
    designPatterns: [],
    accessibility: [],
    responsiveBreakpoints: {},
  };
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
