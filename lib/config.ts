// // lib/config.ts
// export const config = {
//   // HuggingFace API Configuration
//   huggingface: {
//     apiUrl: "https://api-inference.huggingface.co",
//     token: process.env.HUGGINGFACE_API_TOKEN,
//     models: {
//       vision: "microsoft/DiT-base-finetuned-ade20k-512-512", // For image understanding
//       ocr: "microsoft/trocr-base-printed", // For OCR
//       imageCaption: "Salesforce/blip-image-captioning-base", // For image descriptions
//     },
//   },

//   // OpenRouter API Configuration
//   openrouter: {
//     apiUrl: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
//     models: {
//       smart: "anthropic/claude-3-haiku", // Fast, cheap model
//       advanced: "anthropic/claude-3-sonnet", // More capable model
//     },
//   },

//   // Application Settings
//   app: {
//     maxFileSize: 10 * 1024 * 1024, // 10MB
//     allowedImageTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
//     defaultFramework: "next" as const,
//     defaultComplexity: "medium" as const,
//   },

//   // Rate Limiting
//   rateLimit: {
//     vision: 10, // requests per minute
//     guidance: 5, // requests per minute
//   },
// };

// // Validate environment variables
// export function validateConfig() {
//   const errors: string[] = [];

//   if (!config.huggingface.token) {
//     errors.push("HUGGINGFACE_API_TOKEN is required");
//   }

//   if (!config.openrouter.apiKey) {
//     console.warn("OPENROUTER_API_KEY not set - some features may be limited");
//   }

//   if (errors.length > 0) {
//     throw new Error(`Configuration errors: ${errors.join(", ")}`);
//   }

//   return true;
// }

// lib/config.ts
export const config = {
  // HuggingFace API Configuration
  huggingface: {
    apiUrl: "https://api-inference.huggingface.co",
    token: process.env.HUGGINGFACE_API_TOKEN,
    models: {
      vision: "Salesforce/blip-image-captioning-base",
      ocr: "microsoft/trocr-base-printed",
      imageCaption: "Salesforce/blip-image-captioning-base",
    },
  },

  // OpenRouter API Configuration
  openrouter: {
    apiUrl: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    models: {
      smart: "x-ai/grok-4-fast:free",
      advanced: "x-ai/grok-4-fast:free",
    },
  },

  // Application Settings
  app: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    defaultFramework: "next" as const,
    defaultComplexity: "medium" as const,
  },

  // Rate Limiting
  rateLimit: {
    vision: 10, // requests per minute
    guidance: 5, // requests per minute
  },
};

// Validate environment variables
export function validateConfig() {
  const errors: string[] = [];

  if (!config.huggingface.token) {
    console.warn("HUGGINGFACE_API_TOKEN not set - using fallback for vision");
  }

  if (!config.openrouter.apiKey) {
    console.warn("OPENROUTER_API_KEY not set - using fallback responses");
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(", ")}`);
  }

  return true;
}
