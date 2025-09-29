// // // // // app/api/generate-guidance/route.ts
// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { validateConfig, config } from "@/lib/config";
// // // // import { openRouterClient, rateLimiter } from "@/lib/api-clients";
// // // // import { GuidanceResponse } from "@/lib/types";

// // // // // Validate config on startup
// // // // try {
// // // //   validateConfig();
// // // // } catch (error) {
// // // //   console.error("Configuration validation failed:", error);
// // // // }

// // // // export async function POST(request: NextRequest) {
// // // //   try {
// // // //     // Rate limiting
// // // //     const clientIp =
// // // //       request.headers.get("x-forwarded-for") ||
// // // //       request.headers.get("x-real-ip") ||
// // // //       "unknown";

// // // //     if (
// // // //       !rateLimiter.isAllowed(`guidance:${clientIp}`, config.rateLimit.guidance)
// // // //     ) {
// // // //       return NextResponse.json(
// // // //         {
// // // //           success: false,
// // // //           error: "Rate limit exceeded. Please try again later.",
// // // //         },
// // // //         { status: 429 }
// // // //       );
// // // //     }

// // // //     // Parse request body
// // // //     const body = await request.json();
// // // //     const {
// // // //       description,
// // // //       framework = "next",
// // // //       complexity = "medium",
// // // //       includeAccessibility = true,
// // // //       options = {},
// // // //     } = body;

// // // //     if (!description || typeof description !== "string") {
// // // //       return NextResponse.json(
// // // //         { success: false, error: "Description is required" },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     if (description.length < 10) {
// // // //       return NextResponse.json(
// // // //         {
// // // //           success: false,
// // // //           error: "Description too short. Please provide more details.",
// // // //         },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     // Generate guidance using OpenRouter
// // // //     let guidanceResult: GuidanceResponse;

// // // //     try {
// // // //       guidanceResult = await openRouterClient.generateGuidance(
// // // //         description,
// // // //         framework,
// // // //         complexity
// // // //       );
// // // //     } catch (error) {
// // // //       // Fallback to mock response if API fails
// // // //       console.warn("OpenRouter API failed, using fallback:", error);
// // // //       guidanceResult = generateFallbackGuidance(
// // // //         description,
// // // //         framework,
// // // //         complexity,
// // // //         includeAccessibility
// // // //       );
// // // //     }

// // // //     // Validate and enhance the response
// // // //     const validatedGuidance = validateGuidanceResponse(guidanceResult);

// // // //     return NextResponse.json({
// // // //       success: true,
// // // //       data: validatedGuidance,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Guidance generation error:", error);

// // // //     return NextResponse.json(
// // // //       {
// // // //         success: false,
// // // //         error:
// // // //           error instanceof Error
// // // //             ? error.message
// // // //             : "Failed to generate guidance",
// // // //       },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // // // // Fallback guidance generator (for when API is unavailable)
// // // // function generateFallbackGuidance(
// // // //   description: string,
// // // //   framework: string,
// // // //   complexity: string,
// // // //   includeAccessibility: boolean
// // // // ): GuidanceResponse {
// // // //   const pageType = detectPageType(description);

// // // //   return {
// // // //     pageType,
// // // //     folderStructure: [
// // // //       "components/",
// // // //       "├── layout/",
// // // //       "├── ui/",
// // // //       "├── forms/",
// // // //       "pages/",
// // // //       "styles/",
// // // //       "utils/",
// // // //       "lib/",
// // // //     ],
// // // //     components: generateFallbackComponents(pageType, complexity),
// // // //     complexity: {
// // // //       level: complexity as "simple" | "medium" | "complex",
// // // //       estimatedHours:
// // // //         complexity === "simple" ? 2 : complexity === "medium" ? 4 : 8,
// // // //       factors: [
// // // //         "Component complexity",
// // // //         "Styling requirements",
// // // //         "State management",
// // // //       ],
// // // //     },
// // // //     snippets: [
// // // //       {
// // // //         id: "1",
// // // //         name: `${pageType} Component`,
// // // //         framework,
// // // //         code: `const ${pageType} = () => {\n  return (\n    <Box sx={{ p: 2 }}>\n      <Typography variant="h4">${pageType}</Typography>\n    </Box>\n  );\n};`,
// // // //       },
// // // //     ],
// // // //     styling: {
// // // //       muiProps: {
// // // //         Paper: { elevation: 2, sx: { borderRadius: 2 } },
// // // //         Typography: { variant: "h6", color: "primary" },
// // // //       },
// // // //       tailwindAlternatives: ["shadow-md", "rounded-lg", "bg-white"],
// // // //       responsive: { xs: 12, md: 8, lg: 6 },
// // // //     },
// // // //     accessibility: includeAccessibility
// // // //       ? [
// // // //           "Add ARIA labels for interactive elements",
// // // //           "Ensure keyboard navigation support",
// // // //           "Maintain sufficient color contrast",
// // // //           "Use semantic HTML elements",
// // // //         ]
// // // //       : [],
// // // //   };
// // // // }

// // // // // Detect page type from description
// // // // function detectPageType(description: string): string {
// // // //   const desc = description.toLowerCase();

// // // //   if (
// // // //     desc.includes("login") ||
// // // //     desc.includes("signin") ||
// // // //     desc.includes("auth")
// // // //   ) {
// // // //     return "Login";
// // // //   }
// // // //   if (
// // // //     desc.includes("dashboard") ||
// // // //     desc.includes("admin") ||
// // // //     desc.includes("panel")
// // // //   ) {
// // // //     return "Dashboard";
// // // //   }
// // // //   if (
// // // //     desc.includes("landing") ||
// // // //     desc.includes("hero") ||
// // // //     desc.includes("homepage")
// // // //   ) {
// // // //     return "Landing";
// // // //   }
// // // //   if (
// // // //     desc.includes("form") ||
// // // //     desc.includes("input") ||
// // // //     desc.includes("submit")
// // // //   ) {
// // // //     return "Form";
// // // //   }
// // // //   if (
// // // //     desc.includes("profile") ||
// // // //     desc.includes("account") ||
// // // //     desc.includes("settings")
// // // //   ) {
// // // //     return "Profile";
// // // //   }
// // // //   if (
// // // //     desc.includes("table") ||
// // // //     desc.includes("list") ||
// // // //     desc.includes("data")
// // // //   ) {
// // // //     return "DataDisplay";
// // // //   }

// // // //   return "Page";
// // // // }

// // // // // Generate fallback components based on page type
// // // // function generateFallbackComponents(pageType: string, complexity: string) {
// // // //   const complexityMultiplier =
// // // //     complexity === "simple" ? 1 : complexity === "medium" ? 2 : 3;

// // // //   const baseComponents = {
// // // //     Login: [
// // // //       {
// // // //         name: "LoginForm",
// // // //         count: 1,
// // // //         description: "Main login form with email/password fields",
// // // //         props: ["onSubmit", "loading"],
// // // //       },
// // // //     ],
// // // //     Dashboard: [
// // // //       {
// // // //         name: "Header",
// // // //         count: 1,
// // // //         description: "Top navigation bar",
// // // //         props: ["user", "onLogout"],
// // // //       },
// // // //       {
// // // //         name: "Sidebar",
// // // //         count: 1,
// // // //         description: "Navigation sidebar",
// // // //         props: ["items", "collapsed"],
// // // //       },
// // // //       {
// // // //         name: "DashboardCard",
// // // //         count: 3,
// // // //         description: "Metric display cards",
// // // //         props: ["title", "value", "trend"],
// // // //       },
// // // //     ],
// // // //     Landing: [
// // // //       {
// // // //         name: "HeroSection",
// // // //         count: 1,
// // // //         description: "Main hero banner",
// // // //         props: ["title", "subtitle", "cta"],
// // // //       },
// // // //       {
// // // //         name: "FeatureCard",
// // // //         count: 3,
// // // //         description: "Feature highlight cards",
// // // //         props: ["icon", "title", "description"],
// // // //       },
// // // //     ],
// // // //     Form: [
// // // //       {
// // // //         name: "FormField",
// // // //         count: 1,
// // // //         description: "Reusable form input component",
// // // //         props: ["label", "value", "onChange"],
// // // //       },
// // // //       {
// // // //         name: "SubmitButton",
// // // //         count: 1,
// // // //         description: "Form submission button",
// // // //         props: ["loading", "disabled"],
// // // //       },
// // // //     ],
// // // //   };

// // // //   const components = baseComponents[
// // // //     pageType as keyof typeof baseComponents
// // // //   ] || [
// // // //     {
// // // //       name: "MainComponent",
// // // //       count: 1,
// // // //       description: "Primary component",
// // // //       props: ["children"],
// // // //     },
// // // //   ];

// // // //   // Add complexity-based components
// // // //   if (complexityMultiplier > 1) {
// // // //     components.push(
// // // //       {
// // // //         name: "LoadingSpinner",
// // // //         count: 1,
// // // //         description: "Loading state component",
// // // //         props: ["size", "color"],
// // // //       },
// // // //       {
// // // //         name: "ErrorBoundary",
// // // //         count: 1,
// // // //         description: "Error handling wrapper",
// // // //         props: ["children", "fallback"],
// // // //       }
// // // //     );
// // // //   }

// // // //   return components;
// // // // }

// // // // // Validate and ensure guidance response has required fields
// // // // function validateGuidanceResponse(guidance: any): GuidanceResponse {
// // // //   return {
// // // //     pageType: guidance.pageType || "Page",
// // // //     folderStructure: Array.isArray(guidance.folderStructure)
// // // //       ? guidance.folderStructure
// // // //       : ["components/", "pages/", "styles/", "utils/"],
// // // //     components: Array.isArray(guidance.components)
// // // //       ? guidance.components.map((comp: any) => ({
// // // //           name: comp.name || "Component",
// // // //           count: typeof comp.count === "number" ? comp.count : 1,
// // // //           description: comp.description || "Component description",
// // // //           props: Array.isArray(comp.props) ? comp.props : [],
// // // //         }))
// // // //       : [],
// // // //     complexity: {
// // // //       level: guidance.complexity?.level || "medium",
// // // //       estimatedHours: guidance.complexity?.estimatedHours || 4,
// // // //       factors: Array.isArray(guidance.complexity?.factors)
// // // //         ? guidance.complexity.factors
// // // //         : ["Component complexity", "Styling requirements"],
// // // //     },
// // // //     snippets: Array.isArray(guidance.snippets)
// // // //       ? guidance.snippets.map((snippet: any) => ({
// // // //           id: snippet.id || Math.random().toString(36).substr(2, 9),
// // // //           name: snippet.name || "Code Snippet",
// // // //           framework: snippet.framework || "next",
// // // //           code: snippet.code || "// Code snippet",
// // // //         }))
// // // //       : [],
// // // //     styling: {
// // // //       muiProps: guidance.styling?.muiProps || {},
// // // //       tailwindAlternatives: Array.isArray(
// // // //         guidance.styling?.tailwindAlternatives
// // // //       )
// // // //         ? guidance.styling.tailwindAlternatives
// // // //         : ["bg-white", "shadow-md"],
// // // //       responsive: guidance.styling?.responsive || { xs: 12, md: 6 },
// // // //     },
// // // //     accessibility: Array.isArray(guidance.accessibility)
// // // //       ? guidance.accessibility
// // // //       : [
// // // //           "Add ARIA labels for interactive elements",
// // // //           "Ensure keyboard navigation support",
// // // //         ],
// // // //   };
// // // // }

// // // // // Handle unsupported methods
// // // // export async function GET() {
// // // //   return NextResponse.json(
// // // //     { success: false, error: "Method not allowed" },
// // // //     { status: 405 }
// // // //   );
// // // // }

// // // // app/api/generate-guidance/route.ts - TEMPORARY FIX FOR TESTING
// // // import { NextRequest, NextResponse } from "next/server";
// // // import { validateConfig, config } from "@/lib/config";
// // // import { openRouterClient, rateLimiter } from "@/lib/api-clients";
// // // import { GuidanceResponse } from "@/lib/types";

// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     console.log("Generate guidance API called");

// // //     const body = await request.json();
// // //     console.log("Request body:", body);

// // //     const { description, framework = "next", complexity = "medium" } = body;

// // //     // TEMPORARY: Remove length validation for testing
// // //     if (!description || typeof description !== "string") {
// // //       return NextResponse.json(
// // //         { success: false, error: "Description is required" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // TEMPORARY: Comment out length validation
// // //     // if (description.length < 10) {
// // //     //   return NextResponse.json(
// // //     //     {
// // //     //       success: false,
// // //     //       error: "Description too short. Please provide more details.",
// // //     //     },
// // //     //     { status: 400 }
// // //     //   );
// // //     // }

// // //     console.log(
// // //       "Generating guidance for:",
// // //       description.substring(0, 50) + "..."
// // //     );

// // //     // Use fallback first for testing
// // //     const guidanceResult = generateFallbackGuidance(
// // //       description,
// // //       framework,
// // //       complexity,
// // //       true
// // //     );

// // //     console.log("Guidance generated successfully");

// // //     return NextResponse.json({
// // //       success: true,
// // //       data: guidanceResult,
// // //     });
// // //   } catch (error) {
// // //     console.error("Guidance generation error:", error);
// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         error:
// // //           error instanceof Error
// // //             ? error.message
// // //             : "Failed to generate guidance",
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // // Keep your existing helper functions here...
// // // function generateFallbackGuidance(
// // //   description: string,
// // //   framework: string,
// // //   complexity: string,
// // //   includeAccessibility: boolean
// // // ): GuidanceResponse {
// // //   const pageType = "Login"; // Hardcode for testing

// // //   return {
// // //     pageType,
// // //     folderStructure: ["components/", "pages/", "styles/", "utils/"],
// // //     components: [
// // //       {
// // //         name: "LoginForm",
// // //         count: 1,
// // //         description: "Main login form component",
// // //         props: ["onSubmit", "loading"],
// // //       },
// // //     ],
// // //     complexity: {
// // //       level: "medium",
// // //       estimatedHours: 4,
// // //       factors: ["Form validation", "State management"],
// // //     },
// // //     snippets: [
// // //       {
// // //         id: "1",
// // //         name: "LoginForm",
// // //         framework: framework,
// // //         code: "const LoginForm = () => { return <div>Login Form</div>; }",
// // //       },
// // //     ],
// // //     styling: {
// // //       muiProps: {},
// // //       tailwindAlternatives: [],
// // //       responsive: { xs: 12, md: 6 },
// // //     },
// // //     accessibility: includeAccessibility ? ["Add ARIA labels"] : [],
// // //   };
// // // }

// // // export async function GET() {
// // //   return NextResponse.json(
// // //     { success: false, error: "Method not allowed" },
// // //     { status: 405 }
// // //   );
// // // }

// // // app/api/generate/route.ts
// // import { NextRequest, NextResponse } from "next/server";
// // import { validateConfig, config } from "@/lib/config";
// // import { openRouterClient, rateLimiter } from "@/lib/api-clients";

// // // Validate config on startup
// // try {
// //   validateConfig();
// // } catch (error) {
// //   console.error("Configuration validation failed:", error);
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     console.log("General generation API called");

// //     // Rate limiting
// //     const clientIp =
// //       request.headers.get("x-forwarded-for") ||
// //       request.headers.get("x-real-ip") ||
// //       "unknown";

// //     if (
// //       !rateLimiter.isAllowed(`generate:${clientIp}`, config.rateLimit.guidance)
// //     ) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Rate limit exceeded. Please try again later.",
// //         },
// //         { status: 429 }
// //       );
// //     }

// //     const body = await request.json();
// //     const { prompt, type = "general" } = body;

// //     if (!prompt || typeof prompt !== "string") {
// //       return NextResponse.json(
// //         { success: false, error: "Prompt is required" },
// //         { status: 400 }
// //       );
// //     }

// //     if (prompt.length < 5) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Prompt too short. Please provide more details.",
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     console.log("Generating response for:", prompt.substring(0, 100) + "...");

// //     let generationResult;

// //     if (config.openrouter.apiKey) {
// //       try {
// //         generationResult = await generateResponseWithAI(prompt, type);
// //         console.log("AI generation successful");
// //       } catch (error) {
// //         console.warn("OpenRouter API failed, using fallback:", error);
// //         generationResult = generateIntelligentFallback(prompt, type);
// //       }
// //     } else {
// //       console.log("Using fallback (no API key)");
// //       generationResult = generateIntelligentFallback(prompt, type);
// //     }

// //     return NextResponse.json({
// //       success: true,
// //       data: generationResult,
// //     });
// //   } catch (error) {
// //     console.error("Generation error:", error);
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error:
// //           error instanceof Error
// //             ? error.message
// //             : "Failed to generate response",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // Generate response using OpenRouter AI
// // async function generateResponseWithAI(
// //   prompt: string,
// //   type: string
// // ): Promise<any> {
// //   // Determine the type of response needed based on prompt content
// //   const responseType = determineResponseType(prompt, type);

// //   let systemPrompt = "";

// //   switch (responseType) {
// //     case "roadmap":
// //       systemPrompt = `You are an expert educator and technology mentor. Create comprehensive learning roadmaps and educational guidance.

// // User Request: ${prompt}

// // Provide a detailed JSON response with this exact structure:
// // {
// //   "title": "Learning Roadmap Title",
// //   "overview": "Brief overview of what will be learned",
// //   "duration": "Estimated time to complete (e.g., '3-6 months')",
// //   "difficulty": "beginner|intermediate|advanced",
// //   "prerequisites": ["prerequisite1", "prerequisite2"],
// //   "phases": [
// //     {
// //       "phase": 1,
// //       "title": "Phase Title",
// //       "duration": "2-3 weeks",
// //       "description": "What you'll learn in this phase",
// //       "topics": ["topic1", "topic2", "topic3"],
// //       "projects": ["project1", "project2"],
// //       "resources": [
// //         {
// //           "type": "documentation|tutorial|course|book",
// //           "title": "Resource Title",
// //           "url": "https://example.com (if available)",
// //           "description": "Why this resource is helpful"
// //         }
// //       ]
// //     }
// //   ],
// //   "finalProjects": ["Advanced project 1", "Advanced project 2"],
// //   "careerPaths": ["Career path 1", "Career path 2"],
// //   "nextSteps": ["What to learn after this roadmap"],
// //   "tips": ["Helpful tip 1", "Helpful tip 2"]
// // }

// // Make the roadmap practical, structured, and actionable.`;
// //       break;

// //     case "webdev":
// //       systemPrompt = `You are a senior web developer and technical architect. Provide comprehensive web development guidance and solutions.

// // User Request: ${prompt}

// // Provide a detailed JSON response with this exact structure:
// // {
// //   "solution": "Main solution/answer to the request",
// //   "technologies": ["tech1", "tech2", "tech3"],
// //   "approach": "Recommended approach/methodology",
// //   "codeExamples": [
// //     {
// //       "language": "html|css|javascript|typescript|etc",
// //       "title": "Code Example Title",
// //       "code": "complete working code example",
// //       "explanation": "How this code works"
// //     }
// //   ],
// //   "folderStructure": ["folder/", "├── subfolder/", "├── file.ext"],
// //   "bestPractices": ["practice1", "practice2", "practice3"],
// //   "commonPitfalls": ["pitfall1", "pitfall2"],
// //   "resources": [
// //     {
// //       "title": "Resource Title",
// //       "url": "https://example.com",
// //       "description": "Why this is helpful"
// //     }
// //   ],
// //   "nextSteps": ["What to do after implementing this"],
// //   "alternatives": ["Alternative approach 1", "Alternative approach 2"]
// // }

// // Focus on practical, production-ready solutions.`;
// //       break;

// //     case "general":
// //     default:
// //       systemPrompt = `You are a knowledgeable assistant that provides comprehensive, well-structured answers to any question.

// // User Request: ${prompt}

// // Provide a detailed JSON response with this exact structure:
// // {
// //   "mainAnswer": "Primary answer to the user's question",
// //   "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
// //   "detailedExplanation": "More detailed explanation if needed",
// //   "examples": [
// //     {
// //       "title": "Example Title",
// //       "description": "Example description",
// //       "details": "Additional details about this example"
// //     }
// //   ],
// //   "relatedTopics": ["Related topic 1", "Related topic 2"],
// //   "resources": [
// //     {
// //       "title": "Resource Title",
// //       "url": "https://example.com (if available)",
// //       "description": "Why this resource is helpful"
// //     }
// //   ],
// //   "actionableSteps": ["Step 1", "Step 2", "Step 3"],
// //   "tips": ["Helpful tip 1", "Helpful tip 2"],
// //   "furtherReading": ["Suggestion 1", "Suggestion 2"]
// // }

// // Make your response comprehensive, accurate, and helpful.`;
// //       break;
// //   }

// //   const response = await openRouterClient.generateCompletion(
// //     systemPrompt,
// //     config.openrouter.models.smart
// //   );

// //   // Extract JSON from response
// //   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
// //   const jsonString = jsonMatch ? jsonMatch[1] : response;

// //   try {
// //     const parsed = JSON.parse(jsonString);
// //     return {
// //       type: responseType,
// //       content: parsed,
// //       rawResponse: response,
// //     };
// //   } catch (error) {
// //     console.error("Failed to parse AI response:", error);
// //     // Return raw response if JSON parsing fails
// //     return {
// //       type: responseType,
// //       content: { mainAnswer: response },
// //       rawResponse: response,
// //     };
// //   }
// // }

// // // Determine what type of response is needed
// // function determineResponseType(prompt: string, type: string): string {
// //   const lowerPrompt = prompt.toLowerCase();

// //   // If type is explicitly set
// //   if (type && type !== "general") {
// //     return type;
// //   }

// //   // Roadmap detection
// //   if (
// //     lowerPrompt.includes("roadmap") ||
// //     lowerPrompt.includes("learn") ||
// //     lowerPrompt.includes("guide to") ||
// //     lowerPrompt.includes("how to become") ||
// //     lowerPrompt.includes("complete guide") ||
// //     lowerPrompt.includes("step by step")
// //   ) {
// //     return "roadmap";
// //   }

// //   // Web development detection
// //   if (
// //     lowerPrompt.includes("html") ||
// //     lowerPrompt.includes("css") ||
// //     lowerPrompt.includes("javascript") ||
// //     lowerPrompt.includes("react") ||
// //     lowerPrompt.includes("web development") ||
// //     lowerPrompt.includes("frontend") ||
// //     lowerPrompt.includes("backend") ||
// //     lowerPrompt.includes("website") ||
// //     lowerPrompt.includes("component") ||
// //     lowerPrompt.includes("api") ||
// //     lowerPrompt.includes("database")
// //   ) {
// //     return "webdev";
// //   }

// //   return "general";
// // }

// // // Fallback when API is not available
// // function generateIntelligentFallback(prompt: string, type: string): any {
// //   const responseType = determineResponseType(prompt, type);

// //   switch (responseType) {
// //     case "roadmap":
// //       return {
// //         type: "roadmap",
// //         content: {
// //           title: "Learning Roadmap",
// //           overview: "A structured approach to learning based on your request",
// //           duration: "3-6 months",
// //           difficulty: "intermediate",
// //           prerequisites: ["Basic computer skills"],
// //           phases: [
// //             {
// //               phase: 1,
// //               title: "Foundation Phase",
// //               duration: "4-6 weeks",
// //               description: "Build fundamental understanding",
// //               topics: ["Core concepts", "Basic principles", "Essential tools"],
// //               projects: ["Beginner project", "Practice exercises"],
// //               resources: [
// //                 {
// //                   type: "documentation",
// //                   title: "Official Documentation",
// //                   description: "Start with official resources",
// //                 },
// //               ],
// //             },
// //           ],
// //           finalProjects: ["Comprehensive project"],
// //           careerPaths: ["Various career opportunities"],
// //           nextSteps: ["Advanced topics", "Specialization areas"],
// //           tips: ["Practice regularly", "Join communities", "Build projects"],
// //         },
// //         rawResponse: "Roadmap generated (API unavailable)",
// //       };

// //     case "webdev":
// //       return {
// //         type: "webdev",
// //         content: {
// //           solution: "Web development solution based on your request",
// //           technologies: ["HTML", "CSS", "JavaScript"],
// //           approach: "Modern web development best practices",
// //           codeExamples: [
// //             {
// //               language: "html",
// //               title: "Basic HTML Structure",
// //               code: `<!DOCTYPE html>
// // <html lang="en">
// // <head>
// //     <meta charset="UTF-8">
// //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //     <title>Your Project</title>
// // </head>
// // <body>
// //     <!-- Your content here -->
// // </body>
// // </html>`,
// //               explanation: "Basic HTML5 document structure",
// //             },
// //           ],
// //           folderStructure: [
// //             "src/",
// //             "├── components/",
// //             "├── styles/",
// //             "├── utils/",
// //           ],
// //           bestPractices: [
// //             "Use semantic HTML",
// //             "Follow accessibility guidelines",
// //             "Optimize performance",
// //           ],
// //           commonPitfalls: [
// //             "Not testing across browsers",
// //             "Ignoring mobile responsiveness",
// //           ],
// //           resources: [
// //             {
// //               title: "MDN Web Docs",
// //               url: "https://developer.mozilla.org",
// //               description: "Comprehensive web development documentation",
// //             },
// //           ],
// //           nextSteps: ["Test your implementation", "Consider optimization"],
// //           alternatives: ["Alternative frameworks", "Different approaches"],
// //         },
// //         rawResponse: "Web development guidance generated (API unavailable)",
// //       };

// //     default:
// //       return {
// //         type: "general",
// //         content: {
// //           mainAnswer: `Based on your question "${prompt}", here's a comprehensive response. (Note: API is currently unavailable, so this is a basic response)`,
// //           keyPoints: ["Key insight 1", "Key insight 2", "Key insight 3"],
// //           detailedExplanation:
// //             "This is a general response to your question. For more detailed information, please try again when the AI service is available.",
// //           examples: [
// //             {
// //               title: "Example",
// //               description: "Relevant example based on your question",
// //               details: "Additional context and information",
// //             },
// //           ],
// //           relatedTopics: ["Related topic 1", "Related topic 2"],
// //           resources: [
// //             {
// //               title: "General Resource",
// //               description: "Helpful resource for your topic",
// //             },
// //           ],
// //           actionableSteps: ["Step 1", "Step 2", "Step 3"],
// //           tips: ["Helpful tip", "Best practice"],
// //           furtherReading: ["Additional resource", "Extended learning"],
// //         },
// //         rawResponse: "General response generated (API unavailable)",
// //       };
// //   }
// // }

// // export async function GET() {
// //   return NextResponse.json(
// //     { success: false, error: "Method not allowed" },
// //     { status: 405 }
// //   );
// // }

// // // app/api/generate/route.ts
// // import { NextRequest, NextResponse } from "next/server";
// // import { validateConfig, config } from "@/lib/config";
// // import { openRouterClient, rateLimiter } from "@/lib/api-clients";

// // try {
// //   validateConfig();
// // } catch (error) {
// //   console.error("Configuration validation failed:", error);
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     console.log("Guidance generation API called");

// //     const clientIp =
// //       request.headers.get("x-forwarded-for") ||
// //       request.headers.get("x-real-ip") ||
// //       "unknown";

// //     if (
// //       !rateLimiter.isAllowed(`generate:${clientIp}`, config.rateLimit.guidance)
// //     ) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Rate limit exceeded. Please try again later.",
// //         },
// //         { status: 429 }
// //       );
// //     }

// //     const body = await request.json();
// //     const { prompt, language = "javascript", framework = "react" } = body;

// //     if (!prompt || typeof prompt !== "string") {
// //       return NextResponse.json(
// //         { success: false, error: "Prompt is required" },
// //         { status: 400 }
// //       );
// //     }

// //     if (prompt.length < 5) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Prompt too short. Please provide more details.",
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     console.log("Generating guidance for:", prompt.substring(0, 100) + "...");

// //     let guidanceResult;

// //     if (config.openrouter.apiKey) {
// //       try {
// //         guidanceResult = await generateGuidanceWithAI(
// //           prompt,
// //           language,
// //           framework
// //         );
// //         console.log("AI guidance generation successful");
// //       } catch (error) {
// //         console.warn("OpenRouter API failed, using fallback:", error);
// //         guidanceResult = generateGuidanceFallback(prompt, language, framework);
// //       }
// //     } else {
// //       console.log("Using fallback (no API key)");
// //       guidanceResult = generateGuidanceFallback(prompt, language, framework);
// //     }

// //     return NextResponse.json({
// //       success: true,
// //       data: guidanceResult,
// //     });
// //   } catch (error) {
// //     console.error("Guidance generation error:", error);
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error:
// //           error instanceof Error
// //             ? error.message
// //             : "Failed to generate guidance",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // async function generateGuidanceWithAI(
// //   prompt: string,
// //   language: string,
// //   framework: string
// // ): Promise<any> {
// //   const systemPrompt = `You are an expert programming instructor and technical mentor. Provide comprehensive step-by-step guidance for any programming topic or code implementation.

// // User Request: ${prompt}
// // Language: ${language}
// // Framework: ${framework}

// // Provide a detailed JSON response with this EXACT structure:
// // {
// //   "title": "Clear title for this guidance",
// //   "overview": "Brief overview of what will be covered",
// //   "difficulty": "beginner|intermediate|advanced",
// //   "estimatedTime": "Time to complete (e.g., '2-3 hours')",
// //   "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
// //   "stepByStepGuide": [
// //     {
// //       "step": 1,
// //       "title": "Step Title",
// //       "description": "Detailed explanation of what to do",
// //       "codeExample": "// Code example for this step\nconst example = 'code here';",
// //       "explanation": "Why this step is important and how it works",
// //       "tips": ["Helpful tip 1", "Common mistake to avoid"]
// //     }
// //   ],
// //   "completeExample": {
// //     "title": "Full Working Example",
// //     "code": "// Complete working code example\n// With all steps integrated",
// //     "explanation": "How all the pieces fit together"
// //   },
// //   "bestPractices": [
// //     "Best practice 1",
// //     "Best practice 2",
// //     "Best practice 3"
// //   ],
// //   "commonPitfalls": [
// //     {
// //       "issue": "Common issue description",
// //       "solution": "How to fix or avoid it"
// //     }
// //   ],
// //   "testing": {
// //     "description": "How to test this implementation",
// //     "examples": ["Test case 1", "Test case 2"]
// //   },
// //   "resources": [
// //     {
// //       "title": "Resource Title",
// //       "url": "https://example.com",
// //       "description": "Why this resource is helpful"
// //     }
// //   ],
// //   "nextSteps": ["What to learn next", "How to expand this knowledge"],
// //   "relatedTopics": ["Related topic 1", "Related topic 2"]
// // }

// // Make the guidance practical, clear, and actionable with real working code examples.`;

// //   const response = await openRouterClient.generateCompletion(
// //     systemPrompt,
// //     config.openrouter.models.smart
// //   );

// //   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
// //   const jsonString = jsonMatch ? jsonMatch[1] : response;

// //   try {
// //     const parsed = JSON.parse(jsonString);
// //     return {
// //       type: "guidance",
// //       content: parsed,
// //       rawResponse: response,
// //     };
// //   } catch (error) {
// //     console.error("Failed to parse AI response:", error);
// //     return {
// //       type: "guidance",
// //       content: {
// //         title: "Programming Guidance",
// //         overview: response.substring(0, 200),
// //         stepByStepGuide: [],
// //         completeExample: { code: response, explanation: "Generated guidance" },
// //       },
// //       rawResponse: response,
// //     };
// //   }
// // }

// // function generateGuidanceFallback(
// //   prompt: string,
// //   language: string,
// //   framework: string
// // ): any {
// //   return {
// //     type: "guidance",
// //     content: {
// //       title: `${language} ${framework} Guidance`,
// //       overview: `Step-by-step guidance for: ${prompt}`,
// //       difficulty: "intermediate",
// //       estimatedTime: "2-3 hours",
// //       prerequisites: [
// //         `Basic ${language} knowledge`,
// //         `${framework} fundamentals`,
// //       ],
// //       stepByStepGuide: [
// //         {
// //           step: 1,
// //           title: "Setup Your Environment",
// //           description: `Set up your ${framework} project with ${language}`,
// //           codeExample: `// Initialize your ${framework} project\n// Install dependencies\n// Configure ${language}`,
// //           explanation: "Start with a proper project structure",
// //           tips: ["Use a package manager", "Follow best practices"],
// //         },
// //         {
// //           step: 2,
// //           title: "Implement Core Functionality",
// //           description: "Build the main features based on your requirements",
// //           codeExample: `// Core implementation\nconst implementation = () => {\n  // Your code here\n};`,
// //           explanation: "Focus on clean, maintainable code",
// //           tips: ["Keep it simple", "Write modular code"],
// //         },
// //       ],
// //       completeExample: {
// //         title: "Complete Working Example",
// //         code: `// ${prompt}\n// Complete example implementation\n\nfunction example() {\n  console.log('Implementation here');\n}\n\nexport default example;`,
// //         explanation: "This is a basic template. Customize based on your needs.",
// //       },
// //       bestPractices: [
// //         "Follow coding standards",
// //         "Write clean, readable code",
// //         "Add proper error handling",
// //         "Include comments for complex logic",
// //       ],
// //       commonPitfalls: [
// //         {
// //           issue: "Not handling edge cases",
// //           solution: "Always validate inputs and handle errors",
// //         },
// //       ],
// //       testing: {
// //         description: "Test your implementation thoroughly",
// //         examples: ["Unit tests", "Integration tests"],
// //       },
// //       resources: [
// //         {
// //           title: `${language} Documentation`,
// //           url: "https://developer.mozilla.org",
// //           description: "Official documentation and guides",
// //         },
// //       ],
// //       nextSteps: ["Add more features", "Optimize performance", "Add tests"],
// //       relatedTopics: ["Advanced patterns", "Performance optimization"],
// //     },
// //     rawResponse: "Guidance generated (API unavailable)",
// //   };
// // }

// // export async function GET() {
// //   return NextResponse.json(
// //     { success: false, error: "Method not allowed" },
// //     { status: 405 }
// //   );
// // }

// // app/api/generate/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { validateConfig, config } from "@/lib/config";
// import { openRouterClient, rateLimiter } from "@/lib/api-clients";

// try {
//   validateConfig();
// } catch (error) {
//   console.error("Configuration validation failed:", error);
// }

// export async function POST(request: NextRequest) {
//   try {
//     console.log("Guidance generation API called");

//     const clientIp =
//       request.headers.get("x-forwarded-for") ||
//       request.headers.get("x-real-ip") ||
//       "unknown";

//     if (
//       !rateLimiter.isAllowed(`generate:${clientIp}`, config.rateLimit.guidance)
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Rate limit exceeded. Please try again later.",
//         },
//         { status: 429 }
//       );
//     }

//     const body = await request.json();
//     const { prompt } = body;

//     if (!prompt || typeof prompt !== "string") {
//       return NextResponse.json(
//         { success: false, error: "Prompt is required" },
//         { status: 400 }
//       );
//     }

//     if (prompt.length < 3) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Prompt too short. Please provide more details.",
//         },
//         { status: 400 }
//       );
//     }

//     console.log("Generating guidance for:", prompt.substring(0, 100) + "...");

//     if (!config.openrouter.apiKey) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "API key not configured. Please add your OpenRouter API key.",
//         },
//         { status: 503 }
//       );
//     }

//     try {
//       const guidanceResult = await generateGuidanceWithAI(prompt);
//       console.log("AI guidance generation successful");

//       return NextResponse.json({
//         success: true,
//         data: guidanceResult,
//       });
//     } catch (error) {
//       console.error("OpenRouter API failed:", error);
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             error instanceof Error
//               ? error.message
//               : "Failed to generate guidance. Please try again.",
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Guidance generation error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Failed to generate guidance",
//       },
//       { status: 500 }
//     );
//   }
// }

// async function generateGuidanceWithAI(prompt: string): Promise<any> {
//   const systemPrompt = `You are an expert programming instructor, web development mentor, and technical guide. Your role is to provide comprehensive, practical guidance for ANY programming topic, framework, language, or web development concept.

// User Request: "${prompt}"

// Analyze the user's request and provide detailed guidance. This could be:
// - Learning a new language (HTML, CSS, JavaScript, Python, etc.)
// - Understanding frameworks (React, Vue, Angular, Next.js, Express, Django, etc.)
// - Web development concepts (responsive design, accessibility, SEO, performance)
// - Best practices and design patterns
// - Tools and workflows (Git, npm, webpack, etc.)
// - Specific implementations or features

// Provide a detailed JSON response with this EXACT structure:
// {
//   "title": "Clear, engaging title for this guidance",
//   "overview": "2-3 sentence overview explaining what will be covered and why it's valuable",
//   "difficulty": "beginner|intermediate|advanced",
//   "estimatedTime": "Realistic time estimate (e.g., '30 minutes', '2-3 hours', '1 week')",
//   "prerequisites": [
//     "Prerequisite 1 (be specific)",
//     "Prerequisite 2",
//     "Prerequisite 3"
//   ],
//   "learningObjectives": [
//     "By the end, you will be able to...",
//     "You will understand...",
//     "You will master..."
//   ],
//   "stepByStepGuide": [
//     {
//       "step": 1,
//       "title": "Descriptive Step Title",
//       "description": "Detailed explanation of what to do in this step (3-5 sentences)",
//       "codeExample": "// Real, working code example\n// Well-commented and practical\nconst example = 'actual code here';",
//       "explanation": "Deep dive into why this step matters, how it works, and what's happening under the hood",
//       "tips": [
//         "Practical tip that adds value",
//         "Common mistake to avoid",
//         "Pro-level insight"
//       ],
//       "keyPoints": [
//         "Important concept to remember",
//         "Critical detail not to miss"
//       ]
//     }
//   ],
//   "completeExample": {
//     "title": "Full Working Example",
//     "description": "What this complete example demonstrates",
//     "code": "// Complete, production-ready code example\n// That integrates all the concepts\n// Well-structured and documented",
//     "explanation": "Comprehensive explanation of how all pieces work together",
//     "liveDemo": "Description of what happens when this code runs"
//   },
//   "bestPractices": [
//     "Industry-standard best practice with reasoning",
//     "Performance consideration with explanation",
//     "Scalability tip with context",
//     "Security consideration with details"
//   ],
//   "commonPitfalls": [
//     {
//       "issue": "Specific common mistake or misunderstanding",
//       "solution": "Clear solution with explanation",
//       "example": "Code example showing wrong vs right approach"
//     }
//   ],
//   "advancedTips": [
//     "Professional-level insight",
//     "Optimization technique",
//     "Lesser-known feature or approach"
//   ],
//   "testing": {
//     "description": "How to test and validate this implementation",
//     "strategies": [
//       "Testing approach 1",
//       "Testing approach 2"
//     ],
//     "examples": [
//       "// Practical test example 1",
//       "// Practical test example 2"
//     ]
//   },
//   "troubleshooting": [
//     {
//       "problem": "Common issue that might arise",
//       "diagnosis": "How to identify this problem",
//       "solution": "Step-by-step fix"
//     }
//   ],
//   "realWorldApplications": [
//     "Where this is used in production",
//     "Industry example of this concept",
//     "Popular websites/apps using this"
//   ],
//   "resources": [
//     {
//       "title": "Official Documentation",
//       "url": "https://actual-url.com",
//       "description": "What you'll find and why it's valuable",
//       "type": "documentation|tutorial|article|video|tool"
//     }
//   ],
//   "nextSteps": [
//     "Immediate next thing to learn or build",
//     "How to expand this knowledge",
//     "Related advanced concept to explore"
//   ],
//   "relatedTopics": [
//     "Related concept 1 with brief description",
//     "Related concept 2 with brief description"
//   ],
//   "practiceProjects": [
//     {
//       "title": "Project name",
//       "description": "What to build",
//       "difficulty": "beginner|intermediate|advanced",
//       "skills": ["Skill practiced", "Concept reinforced"]
//     }
//   ]
// }

// IMPORTANT GUIDELINES:
// 1. Make all code examples REAL, WORKING code - not placeholders or pseudocode
// 2. Provide SPECIFIC, ACTIONABLE guidance - not generic advice
// 3. Include CURRENT best practices and modern approaches
// 4. Use ACTUAL URLs for resources (official docs, MDN, reputable tutorials)
// 5. Make step-by-step guide comprehensive with at least 5-8 detailed steps
// 6. Tailor complexity to match the user's request
// 7. Include practical examples from real-world scenarios
// 8. Be thorough but clear - explain complex concepts in understandable terms
// 9. Always return valid JSON - no additional text outside the JSON structure

// Generate comprehensive, professional-grade guidance that truly helps the user master this topic.`;

//   const response = await openRouterClient.generateCompletion(
//     systemPrompt,
//     config.openrouter.models.smart
//   );

//   // Extract JSON from response (handle code blocks)
//   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
//   const jsonString = jsonMatch ? jsonMatch[1].trim() : response.trim();

//   try {
//     const parsed = JSON.parse(jsonString);

//     // Validate that we have the minimum required structure
//     if (!parsed.title || !parsed.overview || !parsed.stepByStepGuide) {
//       throw new Error("Invalid response structure from AI");
//     }

//     return {
//       type: "guidance",
//       content: parsed,
//       generatedAt: new Date().toISOString(),
//       query: prompt,
//     };
//   } catch (parseError) {
//     console.error("Failed to parse AI response:", parseError);
//     console.error("Raw response:", response);

//     // Try to extract useful content even if JSON parsing fails
//     return {
//       type: "guidance",
//       content: {
//         title: "Programming Guidance",
//         overview: "AI-generated guidance for your query",
//         difficulty: "intermediate",
//         estimatedTime: "Varies based on topic",
//         prerequisites: ["Basic programming knowledge"],
//         stepByStepGuide: [
//           {
//             step: 1,
//             title: "Getting Started",
//             description: response.substring(0, 500),
//             codeExample: "// See full response for details",
//             explanation:
//               "The AI provided guidance but in an unexpected format.",
//             tips: ["Review the full response below"],
//           },
//         ],
//         completeExample: {
//           title: "AI Response",
//           code: response,
//           explanation: "Full AI-generated response",
//         },
//         bestPractices: ["Follow official documentation", "Practice regularly"],
//         commonPitfalls: [],
//         testing: { description: "Test as you learn", examples: [] },
//         resources: [],
//         nextSteps: ["Continue learning", "Build projects"],
//         relatedTopics: [],
//       },
//       rawResponse: response,
//       parseError: true,
//       generatedAt: new Date().toISOString(),
//       query: prompt,
//     };
//   }
// }

// export async function GET() {
//   return NextResponse.json(
//     {
//       success: false,
//       error: "Method not allowed. Use POST to generate guidance.",
//       usage: {
//         method: "POST",
//         endpoint: "/api/generate",
//         body: {
//           prompt:
//             "Your question or topic (e.g., 'teach me HTML basics', 'how to make responsive website', 'React hooks guide')",
//         },
//       },
//     },
//     { status: 405 }
//   );
// }

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
