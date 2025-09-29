// lib/api-clients.ts
import { config } from "./config";
import { GuidanceResponse } from "./types";
// HuggingFace API client
export class HuggingFaceClient {
  private baseUrl = config.huggingface.apiUrl;
  private token = config.huggingface.token;

  async queryModel(model: string, data: any): Promise<any> {
    if (!this.token) {
      throw new Error("HuggingFace API token not configured");
    }

    const response = await fetch(`${this.baseUrl}/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: data }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HuggingFace API error: ${error}`);
    }

    return response.json();
  }

  async analyzeImage(imageBuffer: Buffer): Promise<{
    caption: string;
    confidence: number;
  }> {
    try {
      const result = await this.queryModel(
        config.huggingface.models.imageCaption,
        {
          image: imageBuffer.toString("base64"),
        }
      );

      return {
        caption: result[0]?.generated_text || "Unable to analyze image",
        confidence: result[0]?.score || 0.5,
      };
    } catch (error) {
      console.error("Image analysis error:", error);
      throw new Error("Failed to analyze image");
    }
  }

  async extractText(imageBuffer: Buffer): Promise<{
    text: string;
    confidence: number;
  }> {
    try {
      const result = await this.queryModel(config.huggingface.models.ocr, {
        image: imageBuffer.toString("base64"),
      });

      return {
        text: result?.generated_text || "",
        confidence: result?.score || 0.5,
      };
    } catch (error) {
      console.error("OCR error:", error);
      // Fallback to empty text
      return {
        text: "",
        confidence: 0,
      };
    }
  }
}

// OpenRouter API client
export class OpenRouterClient {
  private baseUrl = config.openrouter.apiUrl;
  private apiKey = config.openrouter.apiKey;

  async generateCompletion(
    prompt: string,
    model: string = config.openrouter.models.smart
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Frontend Helper",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async generateGuidance(
    description: string,
    framework: string = "next",
    complexity: string = "medium"
  ): Promise<any> {
    const prompt = `You are an expert frontend developer. Analyze this UI description and provide structured development guidance.

UI Description: ${description}
Framework: ${framework}
Complexity Level: ${complexity}

Provide a JSON response with this exact structure:
{
  "pageType": "string (Login, Dashboard, Landing, etc.)",
  "folderStructure": ["array of folder structure"],
  "components": [
    {
      "name": "ComponentName",
      "count": 1,
      "description": "Brief description",
      "props": ["prop1", "prop2"]
    }
  ],
  "complexity": {
    "level": "simple|medium|complex",
    "estimatedHours": 4,
    "factors": ["factor1", "factor2"]
  },
  "snippets": [
    {
      "id": "1",
      "name": "Component Name",
      "framework": "${framework}",
      "code": "const Component = () => { return <div>...</div>; }"
    }
  ],
  "styling": {
    "muiProps": {},
    "tailwindAlternatives": ["class1", "class2"],
    "responsive": {"xs": 12, "md": 6}
  },
  "accessibility": ["tip1", "tip2"]
}`;

    const response = await this.generateCompletion(
      prompt,
      config.openrouter.models.advanced
    );

    // Extract JSON from response
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error("Invalid JSON response from AI");
    }
  }
}

// Rate limiting utility
class RateLimiter {
  private requests = new Map<string, number[]>();

  isAllowed(key: string, limit: number, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const timestamps = this.requests.get(key)!;

    // Remove old timestamps
    const validTimestamps = timestamps.filter((t) => t > windowStart);
    this.requests.set(key, validTimestamps);

    if (validTimestamps.length >= limit) {
      return false;
    }

    // Add current request
    validTimestamps.push(now);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
export const huggingFaceClient = new HuggingFaceClient();
export const openRouterClient = new OpenRouterClient();
