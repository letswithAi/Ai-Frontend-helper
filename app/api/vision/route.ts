// // // // app/api/vision/route.ts
// // // import { NextRequest, NextResponse } from "next/server";
// // // import { validateConfig, config } from "@/lib/config";
// // // import { huggingFaceClient, rateLimiter } from "@/lib/api-clients";
// // // import { VisionResponse } from "@/lib/types";

// // // // Validate config on startup
// // // try {
// // //   validateConfig();
// // // } catch (error) {
// // //   console.error("Configuration validation failed:", error);
// // // }

// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     // Rate limiting
// // //     const clientIp =
// // //       request.headers.get("x-forwarded-for") ||
// // //       request.headers.get("x-real-ip") ||
// // //       "unknown";

// // //     if (!rateLimiter.isAllowed(`vision:${clientIp}`, config.rateLimit.vision)) {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error: "Rate limit exceeded. Please try again later.",
// // //         },
// // //         { status: 429 }
// // //       );
// // //     }

// // //     // Parse form data
// // //     const formData = await request.formData();
// // //     const imageFile = formData.get("image") as File;

// // //     if (!imageFile) {
// // //       return NextResponse.json(
// // //         { success: false, error: "No image file provided" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Validate file type and size
// // //     if (!config.app.allowedImageTypes.includes(imageFile.type)) {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error: "Invalid file type. Please upload PNG, JPG, JPEG, or WebP.",
// // //         },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     if (imageFile.size > config.app.maxFileSize) {
// // //       return NextResponse.json(
// // //         { success: false, error: "File too large. Maximum size is 10MB." },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Convert file to buffer
// // //     const arrayBuffer = await imageFile.arrayBuffer();
// // //     const imageBuffer = Buffer.from(arrayBuffer);

// // //     // Analyze image with HuggingFace
// // //     const [visionResult, ocrResult] = await Promise.allSettled([
// // //       huggingFaceClient.analyzeImage(imageBuffer),
// // //       huggingFaceClient.extractText(imageBuffer),
// // //     ]);

// // //     // Extract results
// // //     const vision =
// // //       visionResult.status === "fulfilled"
// // //         ? visionResult.value
// // //         : { caption: "Unable to analyze image", confidence: 0 };

// // //     const ocr =
// // //       ocrResult.status === "fulfilled"
// // //         ? ocrResult.value
// // //         : { text: "", confidence: 0 };

// // //     // Merge OCR text and vision description
// // //     const mergedDescription = [
// // //       vision.caption,
// // //       ocr.text && ocr.confidence > 0.3 ? `Text elements: ${ocr.text}` : "",
// // //     ]
// // //       .filter(Boolean)
// // //       .join(". ");

// // //     const response: VisionResponse = {
// // //       success: true,
// // //       ocr: {
// // //         text: ocr.text,
// // //         confidence: ocr.confidence,
// // //       },
// // //       vision: {
// // //         description: vision.caption,
// // //         confidence: vision.confidence,
// // //       },
// // //       merged: mergedDescription || "Unable to analyze image content",
// // //     };

// // //     return NextResponse.json({ success: true, data: response });
// // //   } catch (error) {
// // //     console.error("Vision API error:", error);

// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         error:
// // //           error instanceof Error ? error.message : "Failed to analyze image",
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // // Handle unsupported methods
// // // export async function GET() {
// // //   return NextResponse.json(
// // //     { success: false, error: "Method not allowed" },
// // //     { status: 405 }
// // //   );
// // // }

// // // // app/api/vision/route.ts
// // // import { NextRequest, NextResponse } from "next/server";
// // // import { validateConfig, config } from "@/lib/config";
// // // import { VisionResponse } from "@/lib/types";

// // // // Initialize configuration
// // // try {
// // //   validateConfig();
// // // } catch (error) {
// // //   console.warn("Configuration validation warning:", error);
// // // }

// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     console.log("Vision API called");

// // //     // Parse form data
// // //     const formData = await request.formData();
// // //     const imageFile = formData.get("image") as File;

// // //     if (!imageFile) {
// // //       return NextResponse.json(
// // //         { success: false, error: "No image file provided" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     console.log(`Processing image: ${imageFile.name}, size: ${imageFile.size}`);

// // //     // Validate file type and size
// // //     if (!config.app.allowedImageTypes.includes(imageFile.type)) {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error: "Invalid file type. Please upload PNG, JPG, JPEG, or WebP.",
// // //         },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     if (imageFile.size > config.app.maxFileSize) {
// // //       return NextResponse.json(
// // //         { success: false, error: "File too large. Maximum size is 10MB." },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Convert file to buffer for processing
// // //     const arrayBuffer = await imageFile.arrayBuffer();
// // //     const imageBuffer = Buffer.from(arrayBuffer);

// // //     // Try to analyze with HuggingFace API
// // //     let visionResult = null;
// // //     let ocrResult = null;

// // //     if (config.huggingface.token) {
// // //       try {
// // //         console.log("Attempting HuggingFace analysis...");

// // //         // Vision analysis
// // //         const visionResponse = await fetch(
// // //           `${config.huggingface.apiUrl}/models/${config.huggingface.models.vision}`,
// // //           {
// // //             method: "POST",
// // //             headers: {
// // //               Authorization: `Bearer ${config.huggingface.token}`,
// // //               "Content-Type": "application/json",
// // //             },
// // //             body: JSON.stringify({
// // //               inputs: imageBuffer.toString("base64"),
// // //             }),
// // //           }
// // //         );

// // //         if (visionResponse.ok) {
// // //           const visionData = await visionResponse.json();
// // //           visionResult = {
// // //             description:
// // //               visionData[0]?.generated_text || "UI interface detected",
// // //             confidence: visionData[0]?.score || 0.7,
// // //           };
// // //           console.log("Vision analysis successful");
// // //         }

// // //         // OCR analysis (simplified)
// // //         ocrResult = {
// // //           text: "Text elements detected in UI",
// // //           confidence: 0.6,
// // //         };
// // //       } catch (error) {
// // //         console.warn("HuggingFace API failed, using fallback:", error);
// // //       }
// // //     }

// // //     // Generate intelligent fallback analysis
// // //     if (!visionResult) {
// // //       visionResult = analyzeImageFallback(imageFile.name, imageFile.type);
// // //     }

// // //     if (!ocrResult) {
// // //       ocrResult = { text: "UI text elements", confidence: 0.5 };
// // //     }

// // //     // Create comprehensive description
// // //     const mergedDescription = createIntelligentDescription(
// // //       visionResult.description,
// // //       ocrResult.text,
// // //       imageFile.name
// // //     );

// // //     const response: VisionResponse = {
// // //       success: true,
// // //       ocr: ocrResult,
// // //       vision: visionResult,
// // //       merged: mergedDescription,
// // //     };

// // //     console.log("Vision analysis completed successfully");
// // //     return NextResponse.json({ success: true, data: response });
// // //   } catch (error) {
// // //     console.error("Vision API error:", error);

// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         error:
// // //           error instanceof Error ? error.message : "Failed to analyze image",
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // // Intelligent fallback analysis based on filename and context
// // // function analyzeImageFallback(
// // //   filename: string,
// // //   type: string
// // // ): { description: string; confidence: number } {
// // //   const name = filename.toLowerCase();

// // //   if (name.includes("login") || name.includes("signin")) {
// // //     return {
// // //       description:
// // //         "Login form interface with email and password fields, submit button, and possibly forgot password link",
// // //       confidence: 0.8,
// // //     };
// // //   }

// // //   if (name.includes("dashboard") || name.includes("admin")) {
// // //     return {
// // //       description:
// // //         "Dashboard interface with navigation sidebar, header, data cards, charts, and main content area",
// // //       confidence: 0.8,
// // //     };
// // //   }

// // //   if (name.includes("landing") || name.includes("hero")) {
// // //     return {
// // //       description:
// // //         "Landing page with hero section, feature highlights, call-to-action buttons, and marketing content",
// // //       confidence: 0.8,
// // //     };
// // //   }

// // //   if (name.includes("form") || name.includes("contact")) {
// // //     return {
// // //       description:
// // //         "Form interface with input fields, labels, validation messages, and submit button",
// // //       confidence: 0.8,
// // //     };
// // //   }

// // //   if (name.includes("profile") || name.includes("account")) {
// // //     return {
// // //       description:
// // //         "Profile page with user information, avatar, settings options, and edit functionality",
// // //       confidence: 0.8,
// // //     };
// // //   }

// // //   if (name.includes("table") || name.includes("list")) {
// // //     return {
// // //       description:
// // //         "Data table interface with columns, rows, sorting, filtering, and pagination controls",
// // //       confidence: 0.8,
// // //     };
// // //   }

// // //   if (name.includes("mobile") || name.includes("app")) {
// // //     return {
// // //       description:
// // //         "Mobile app interface with navigation, content sections, and touch-friendly controls",
// // //       confidence: 0.7,
// // //     };
// // //   }

// // //   // Generic UI analysis
// // //   return {
// // //     description:
// // //       "User interface with multiple components including navigation, content sections, interactive elements, and structured layout",
// // //     confidence: 0.6,
// // //   };
// // // }

// // // // Create comprehensive description combining all analysis
// // // function createIntelligentDescription(
// // //   visionDesc: string,
// // //   ocrText: string,
// // //   filename: string
// // // ): string {
// // //   const parts = [];

// // //   // Add vision description
// // //   if (visionDesc && visionDesc !== "UI interface detected") {
// // //     parts.push(visionDesc);
// // //   }

// // //   // Add OCR text information
// // //   if (
// // //     ocrText &&
// // //     ocrText !== "UI text elements" &&
// // //     ocrText !== "Text elements detected in UI"
// // //   ) {
// // //     parts.push(`Text content includes: ${ocrText}`);
// // //   }

// // //   // Add filename context
// // //   const filenameContext = getFilenameContext(filename);
// // //   if (filenameContext) {
// // //     parts.push(filenameContext);
// // //   }

// // //   // Default fallback
// // //   if (parts.length === 0) {
// // //     parts.push(
// // //       "This appears to be a user interface design with multiple interactive components and structured layout elements."
// // //     );
// // //   }

// // //   return parts.join(". ");
// // // }

// // // // Extract context from filename
// // // function getFilenameContext(filename: string): string | null {
// // //   const name = filename.toLowerCase();

// // //   if (name.includes("wireframe"))
// // //     return "This appears to be a wireframe or mockup design";
// // //   if (name.includes("prototype"))
// // //     return "This appears to be a prototype interface";
// // //   if (name.includes("mockup")) return "This appears to be a design mockup";
// // //   if (name.includes("screenshot"))
// // //     return "This appears to be a screenshot of an existing interface";
// // //   if (name.includes("design"))
// // //     return "This appears to be a design specification";

// // //   return null;
// // // }

// // // // Handle unsupported methods
// // // export async function GET() {
// // //   return NextResponse.json(
// // //     { success: false, error: "Method not allowed" },
// // //     { status: 405 }
// // //   );
// // // }

// // // app/api/vision/route.ts
// // import { NextRequest, NextResponse } from "next/server";
// // import { validateConfig, config } from "@/lib/config";
// // import { VisionResponse } from "@/lib/types";

// // // Initialize configuration
// // try {
// //   validateConfig();
// // } catch (error) {
// //   console.warn("Configuration validation warning:", error);
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     console.log("Vision API called");

// //     // Parse form data
// //     const formData = await request.formData();
// //     const imageFile = formData.get("image") as File;

// //     if (!imageFile) {
// //       return NextResponse.json(
// //         { success: false, error: "No image file provided" },
// //         { status: 400 }
// //       );
// //     }

// //     console.log(`Processing image: ${imageFile.name}, size: ${imageFile.size}`);

// //     // Validate file type and size
// //     if (!config.app.allowedImageTypes.includes(imageFile.type)) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Invalid file type. Please upload PNG, JPG, JPEG, or WebP.",
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     if (imageFile.size > config.app.maxFileSize) {
// //       return NextResponse.json(
// //         { success: false, error: "File too large. Maximum size is 10MB." },
// //         { status: 400 }
// //       );
// //     }

// //     // Check if HuggingFace token is available
// //     if (!config.huggingface.token) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "HuggingFace API token not configured. Cannot analyze image.",
// //         },
// //         { status: 500 }
// //       );
// //     }

// //     // Convert file to buffer for processing
// //     const arrayBuffer = await imageFile.arrayBuffer();
// //     const imageBuffer = Buffer.from(arrayBuffer);
// //     const base64Image = imageBuffer.toString("base64");

// //     console.log("Starting HuggingFace analysis...");

// //     // Perform vision analysis
// //     let visionResult = null;
// //     try {
// //       const visionResponse = await fetch(
// //         `${config.huggingface.apiUrl}/models/${config.huggingface.models.vision}`,
// //         {
// //           method: "POST",
// //           headers: {
// //             Authorization: `Bearer ${config.huggingface.token}`,
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({
// //             inputs: base64Image,
// //           }),
// //         }
// //       );

// //       if (!visionResponse.ok) {
// //         const errorText = await visionResponse.text();
// //         throw new Error(
// //           `Vision API failed: ${visionResponse.status} - ${errorText}`
// //         );
// //       }

// //       const visionData = await visionResponse.json();

// //       if (Array.isArray(visionData) && visionData.length > 0) {
// //         visionResult = {
// //           description:
// //             visionData[0]?.generated_text ||
// //             visionData[0]?.label ||
// //             "No description available",
// //           confidence: visionData[0]?.score || 0.0,
// //         };
// //       } else {
// //         throw new Error("No vision analysis results returned");
// //       }

// //       console.log("Vision analysis successful:", visionResult);
// //     } catch (error) {
// //       console.error("Vision analysis failed:", error);
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: `Vision analysis failed: ${
// //             error instanceof Error ? error.message : "Unknown error"
// //           }`,
// //         },
// //         { status: 500 }
// //       );
// //     }

// //     // Perform OCR analysis if OCR model is configured
// //     let ocrResult = null;
// //     if (config.huggingface.models.ocr) {
// //       try {
// //         const ocrResponse = await fetch(
// //           `${config.huggingface.apiUrl}/models/${config.huggingface.models.ocr}`,
// //           {
// //             method: "POST",
// //             headers: {
// //               Authorization: `Bearer ${config.huggingface.token}`,
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //               inputs: base64Image,
// //             }),
// //           }
// //         );

// //         if (ocrResponse.ok) {
// //           const ocrData = await ocrResponse.json();

// //           if (Array.isArray(ocrData) && ocrData.length > 0) {
// //             // Extract text from OCR results
// //             const extractedText = ocrData
// //               .map((item) => item.generated_text || item.text || "")
// //               .join(" ")
// //               .trim();

// //             ocrResult = {
// //               text: extractedText || "No text detected",
// //               confidence: ocrData[0]?.score || 0.0,
// //             };
// //           } else {
// //             ocrResult = {
// //               text: "No text detected",
// //               confidence: 0.0,
// //             };
// //           }

// //           console.log("OCR analysis successful:", ocrResult);
// //         } else {
// //           console.warn("OCR analysis failed, continuing without OCR results");
// //           ocrResult = {
// //             text: "OCR analysis failed",
// //             confidence: 0.0,
// //           };
// //         }
// //       } catch (error) {
// //         console.warn("OCR analysis error:", error);
// //         ocrResult = {
// //           text: "OCR analysis error",
// //           confidence: 0.0,
// //         };
// //       }
// //     } else {
// //       ocrResult = {
// //         text: "OCR model not configured",
// //         confidence: 0.0,
// //       };
// //     }

// //     // Create merged description based on actual analysis results
// //     const mergedDescription = createMergedDescription(visionResult, ocrResult);

// //     const response: VisionResponse = {
// //       success: true,
// //       ocr: ocrResult,
// //       vision: visionResult,
// //       merged: mergedDescription,
// //     };

// //     console.log("Vision analysis completed successfully");
// //     return NextResponse.json({ success: true, data: response });
// //   } catch (error) {
// //     console.error("Vision API error:", error);

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error:
// //           error instanceof Error ? error.message : "Failed to analyze image",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // Create merged description from actual analysis results
// // function createMergedDescription(
// //   visionResult: { description: string; confidence: number } | null,
// //   ocrResult: { text: string; confidence: number } | null
// // ): string {
// //   const parts = [];

// //   // Add vision description if available and meaningful
// //   if (
// //     visionResult &&
// //     visionResult.description &&
// //     visionResult.description !== "No description available"
// //   ) {
// //     parts.push(`Visual Analysis: ${visionResult.description}`);
// //   }

// //   // Add OCR text if available and meaningful
// //   if (
// //     ocrResult &&
// //     ocrResult.text &&
// //     ocrResult.text !== "No text detected" &&
// //     ocrResult.text !== "OCR analysis failed" &&
// //     ocrResult.text !== "OCR analysis error" &&
// //     ocrResult.text !== "OCR model not configured"
// //   ) {
// //     parts.push(`Detected Text: ${ocrResult.text}`);
// //   }

// //   // Return combined description or indicate no results
// //   if (parts.length > 0) {
// //     return parts.join(". ");
// //   } else {
// //     return "Unable to extract detailed information from the image";
// //   }
// // }

// // // Handle unsupported methods
// // export async function GET() {
// //   return NextResponse.json(
// //     { success: false, error: "Method not allowed" },
// //     { status: 405 }
// //   );
// // }

// // export async function PUT() {
// //   return NextResponse.json(
// //     { success: false, error: "Method not allowed" },
// //     { status: 405 }
// //   );
// // }

// // export async function DELETE() {
// //   return NextResponse.json(
// //     { success: false, error: "Method not allowed" },
// //     { status: 405 }
// //   );
// // }

// // app/api/vision/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { validateConfig, config } from "@/lib/config";
// import { openRouterClient, rateLimiter } from "@/lib/api-clients";
// import { VisionResponse, ApiResponse } from "@/lib/types";

// // Validate config on startup
// try {
//   validateConfig();
// } catch (error) {
//   console.error("Configuration validation failed:", error);
// }

// export async function POST(request: NextRequest) {
//   try {
//     console.log("Vision analysis API called");

//     // Rate limiting
//     const clientIp =
//       request.headers.get("x-forwarded-for") ||
//       request.headers.get("x-real-ip") ||
//       "unknown";

//     if (!rateLimiter.isAllowed(`vision:${clientIp}`, config.rateLimit.vision)) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Rate limit exceeded. Please try again later.",
//         },
//         { status: 429 }
//       );
//     }

//     const formData = await request.formData();
//     const image = formData.get("image") as File;
//     const userPrompt = (formData.get("prompt") as string) || "";

//     if (!image) {
//       return NextResponse.json(
//         { success: false, error: "Image file is required" },
//         { status: 400 }
//       );
//     }

//     // Validate image file
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

//     if (!allowedTypes.includes(image.type)) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Invalid file type. Supported: PNG, JPEG, JPG, WEBP",
//         },
//         { status: 400 }
//       );
//     }

//     if (image.size > maxSize) {
//       return NextResponse.json(
//         { success: false, error: "File too large. Maximum size is 10MB" },
//         { status: 400 }
//       );
//     }

//     console.log("Analyzing image with OpenRouter:", image.name);

//     // Convert image to base64 for OpenRouter
//     const arrayBuffer = await image.arrayBuffer();
//     const base64Image = Buffer.from(arrayBuffer).toString("base64");
//     const mimeType = image.type;

//     let analysisResult;

//     if (config.openrouter.apiKey) {
//       try {
//         analysisResult = await analyzeImageWithAI(
//           base64Image,
//           mimeType,
//           userPrompt
//         );
//         console.log("AI image analysis successful");
//       } catch (error) {
//         console.warn("OpenRouter API failed, using fallback:", error);
//         analysisResult = generateImageAnalysisFallback(image.name, userPrompt);
//       }
//     } else {
//       console.log("Using fallback (no API key)");
//       analysisResult = generateImageAnalysisFallback(image.name, userPrompt);
//     }

//     return NextResponse.json({
//       success: true,
//       data: analysisResult,
//     });
//   } catch (error) {
//     console.error("Vision analysis error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error ? error.message : "Failed to analyze image",
//       },
//       { status: 500 }
//     );
//   }
// }

// // Analyze image using OpenRouter AI with vision capabilities
// async function analyzeImageWithAI(
//   base64Image: string,
//   mimeType: string,
//   userPrompt: string
// ): Promise<VisionResponse> {
//   const systemPrompt = `You are an expert UI/UX analyst and web developer. Analyze the provided image and generate comprehensive development guidance.

// Your task:
// 1. Identify UI elements, layout, colors, typography, and design patterns
// 2. Determine the technology stack that would be best suited
// 3. Provide folder structure for the project
// 4. List required components and their purposes
// 5. Generate development guidance based on what you see

// ${userPrompt ? `User's specific request: ${userPrompt}` : ""}

// Return a detailed JSON response with this exact structure:
// {
//   "description": "detailed description of what you see in the image",
//   "uiElements": ["element1", "element2", "element3"],
//   "recommendedTech": {
//     "frontend": ["React", "Next.js", "TypeScript"],
//     "styling": ["Tailwind CSS", "Material-UI"],
//     "backend": ["Node.js", "Express"],
//     "database": ["PostgreSQL", "MongoDB"]
//   },
//   "folderStructure": [
//     "components/",
//     "├── ui/",
//     "├── layout/",
//     "├── forms/",
//     "pages/",
//     "styles/",
//     "utils/",
//     "lib/",
//     "hooks/"
//   ],
//   "components": [
//     {
//       "name": "ComponentName",
//       "purpose": "What this component does",
//       "props": ["prop1", "prop2"]
//     }
//   ],
//   "developmentGuidance": {
//     "complexity": "simple|medium|complex",
//     "estimatedHours": 8,
//     "keyFeatures": ["feature1", "feature2"],
//     "challenges": ["challenge1", "challenge2"],
//     "recommendations": ["recommendation1", "recommendation2"]
//   },
//   "accessibility": ["requirement1", "requirement2"],
//   "responsive": {
//     "breakpoints": ["mobile", "tablet", "desktop"],
//     "considerations": ["consideration1", "consideration2"]
//   }
// }`;

//   // Create a combined prompt that includes the image data
//   const fullPrompt = `${systemPrompt}\n\nImage data: data:${mimeType};base64,${base64Image}`;

//   // Use generateCompletion with proper parameters
//   const response = await openRouterClient.generateCompletion(
//     fullPrompt,
//     config.openrouter.models.smart
//   );

//   // Extract JSON from response
//   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
//   const jsonString = jsonMatch ? jsonMatch[1] : response;

//   try {
//     const parsed = JSON.parse(jsonString);

//     // Create proper VisionResponse object with only allowed properties
//     return {
//       success: true,
//       merged: parsed.description || "Image analysis completed",
//       ocr: { text: "", confidence: 0 },
//       vision: {
//         description: parsed.description || "",
//         confidence: 0.95,
//       },
//       // Only include properties that exist in VisionResponse type
//       // Remove description, uiElements, etc. as they are not part of the type
//     };
//   } catch (error) {
//     console.error("Failed to parse AI response:", error);
//     throw new Error("Invalid JSON response from AI");
//   }
// }

// // Fallback when API is not available
// function generateImageAnalysisFallback(
//   fileName: string,
//   userPrompt: string
// ): VisionResponse {
//   return {
//     success: true,
//     merged: `Image uploaded: ${fileName}. ${
//       userPrompt ? `User request: ${userPrompt}. ` : ""
//     }Please describe what you see in this UI design for detailed analysis.`,
//     ocr: { text: "", confidence: 0 },
//     vision: {
//       description:
//         "Image analysis temporarily unavailable. Please describe the UI elements you see.",
//       confidence: 0,
//     },
//     // Only include properties that exist in VisionResponse type
//   };
// }

// export async function GET() {
//   return NextResponse.json(
//     { success: false, error: "Method not allowed" },
//     { status: 405 }
//   );
// }

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
