// // // // // // app/api/generate-code/route.ts
// // // // // import { NextRequest, NextResponse } from "next/server";
// // // // // import { validateConfig, config } from "@/lib/config";
// // // // // import { openRouterClient, rateLimiter } from "@/lib/api-clients";
// // // // // import { GuidanceResponse } from "@/lib/types";

// // // // // // Validate config on startup
// // // // // try {
// // // // //   validateConfig();
// // // // // } catch (error) {
// // // // //   console.error("Configuration validation failed:", error);
// // // // // }

// // // // // export async function POST(request: NextRequest) {
// // // // //   try {
// // // // //     // Rate limiting
// // // // //     const clientIp =
// // // // //       request.headers.get("x-forwarded-for") ||
// // // // //       request.headers.get("x-real-ip") ||
// // // // //       "unknown";

// // // // //     if (!rateLimiter.isAllowed(`code:${clientIp}`, config.rateLimit.guidance)) {
// // // // //       return NextResponse.json(
// // // // //         {
// // // // //           success: false,
// // // // //           error: "Rate limit exceeded. Please try again later.",
// // // // //         },
// // // // //         { status: 429 }
// // // // //       );
// // // // //     }

// // // // //     // Parse request body
// // // // //     const body = await request.json();
// // // // //     const {
// // // // //       guidance,
// // // // //       targetFramework = "next",
// // // // //       includeTests = true,
// // // // //       includeStyles = true,
// // // // //       options = {},
// // // // //     } = body;

// // // // //     if (!guidance) {
// // // // //       return NextResponse.json(
// // // // //         { success: false, error: "Guidance data is required" },
// // // // //         { status: 400 }
// // // // //       );
// // // // //     }

// // // // //     // Generate code using OpenRouter
// // // // //     let codeResult;

// // // // //     try {
// // // // //       codeResult = await generateCodeFromGuidance(
// // // // //         guidance,
// // // // //         targetFramework,
// // // // //         includeTests,
// // // // //         includeStyles
// // // // //       );
// // // // //     } catch (error) {
// // // // //       // Fallback to mock response if API fails
// // // // //       console.warn("Code generation API failed, using fallback:", error);
// // // // //       codeResult = generateFallbackCode(guidance, targetFramework);
// // // // //     }

// // // // //     return NextResponse.json({
// // // // //       success: true,
// // // // //       data: codeResult,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error("Code generation error:", error);

// // // // //     return NextResponse.json(
// // // // //       {
// // // // //         success: false,
// // // // //         error:
// // // // //           error instanceof Error ? error.message : "Failed to generate code",
// // // // //       },
// // // // //       { status: 500 }
// // // // //     );
// // // // //   }
// // // // // }

// // // // // // Generate code from guidance using AI
// // // // // async function generateCodeFromGuidance(
// // // // //   guidance: GuidanceResponse,
// // // // //   targetFramework: string,
// // // // //   includeTests: boolean,
// // // // //   includeStyles: boolean
// // // // // ): Promise<any> {
// // // // //   const prompt = `You are an expert frontend developer. Generate complete code based on the following guidance.

// // // // // Guidance:
// // // // // - Page Type: ${guidance.pageType}
// // // // // - Framework: ${targetFramework}
// // // // // - Components: ${guidance.components.map((c) => c.name).join(", ")}

// // // // // Generate complete, production-ready code with:
// // // // // - Main component implementation
// // // // // - ${
// // // // //     includeStyles
// // // // //       ? "Styled components with Material-UI and Tailwind alternatives"
// // // // //       : "Basic styling"
// // // // //   }
// // // // // - ${includeTests ? "Unit tests" : "No tests"}
// // // // // - Proper TypeScript types
// // // // // - Accessibility features

// // // // // Return a JSON response with this structure:
// // // // // {
// // // // //   "components": [
// // // // //     {
// // // // //       "name": "ComponentName",
// // // // //       "code": "complete code here",
// // // // //       "type": "page|component|layout"
// // // // //     }
// // // // //   ],
// // // // //   "files": [
// // // // //     {
// // // // //       "path": "file/path/Component.tsx",
// // // // //       "content": "file content"
// // // // //     }
// // // // //   ],
// // // // //   "dependencies": ["package1", "package2"]
// // // // // }`;

// // // // //   const response = await openRouterClient.generateCompletion(
// // // // //     prompt,
// // // // //     config.openrouter.models.advanced
// // // // //   );

// // // // //   // Extract JSON from response
// // // // //   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
// // // // //   const jsonString = jsonMatch ? jsonMatch[1] : response;

// // // // //   try {
// // // // //     return JSON.parse(jsonString);
// // // // //   } catch (error) {
// // // // //     throw new Error("Invalid JSON response from AI");
// // // // //   }
// // // // // }

// // // // // // Fallback code generator
// // // // // function generateFallbackCode(
// // // // //   guidance: GuidanceResponse,
// // // // //   targetFramework: string
// // // // // ): any {
// // // // //   const mainComponent = `
// // // // // import React from 'react';
// // // // // import { Box, Typography, Paper } from '@mui/material';

// // // // // const ${guidance.pageType} = () => {
// // // // //   return (
// // // // //     <Box sx={{ p: 2 }}>
// // // // //       <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
// // // // //         <Typography variant="h4" gutterBottom>
// // // // //           ${guidance.pageType} Page
// // // // //         </Typography>
// // // // //         <Typography variant="body1">
// // // // //           This is a generated ${guidance.pageType.toLowerCase()} page component.
// // // // //         </Typography>
// // // // //       </Paper>
// // // // //     </Box>
// // // // //   );
// // // // // };

// // // // // export default ${guidance.pageType};
// // // // // `;

// // // // //   return {
// // // // //     components: [
// // // // //       {
// // // // //         name: guidance.pageType,
// // // // //         code: mainComponent,
// // // // //         type: "page",
// // // // //       },
// // // // //     ],
// // // // //     files: [
// // // // //       {
// // // // //         path: `components/${guidance.pageType}.tsx`,
// // // // //         content: mainComponent,
// // // // //       },
// // // // //     ],
// // // // //     dependencies: ["@mui/material", "@emotion/react", "@emotion/styled"],
// // // // //   };
// // // // // }

// // // // // // Handle unsupported methods
// // // // // export async function GET() {
// // // // //   return NextResponse.json(
// // // // //     { success: false, error: "Method not allowed" },
// // // // //     { status: 405 }
// // // // //   );
// // // // // }

// // // // // app/api/code/route.ts
// // // // // app/api/code/route.ts
// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { validateConfig, config } from "@/lib/config";
// // // // import { openRouterClient, rateLimiter } from "@/lib/api-clients";

// // // // // Validate config on startup
// // // // try {
// // // //   validateConfig();
// // // // } catch (error) {
// // // //   console.error("Configuration validation failed:", error);
// // // // }

// // // // export async function POST(request: NextRequest) {
// // // //   try {
// // // //     console.log("Code generation API called");

// // // //     // Rate limiting
// // // //     const clientIp =
// // // //       request.headers.get("x-forwarded-for") ||
// // // //       request.headers.get("x-real-ip") ||
// // // //       "unknown";

// // // //     if (!rateLimiter.isAllowed(`code:${clientIp}`, config.rateLimit.guidance)) {
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
// // // //       prompt,
// // // //       language = "javascript",
// // // //       framework = "",
// // // //       includeTests = false,
// // // //       includeComments = true,
// // // //       complexity = "medium",
// // // //     } = body;

// // // //     if (!prompt || typeof prompt !== "string") {
// // // //       return NextResponse.json(
// // // //         { success: false, error: "Code prompt is required" },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     if (prompt.length < 5) {
// // // //       return NextResponse.json(
// // // //         {
// // // //           success: false,
// // // //           error:
// // // //             "Prompt too short. Please provide more details about the code you want.",
// // // //         },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     console.log("Generating code for:", prompt.substring(0, 100) + "...");

// // // //     let codeResult;

// // // //     if (config.openrouter.apiKey) {
// // // //       try {
// // // //         codeResult = await generateCodeWithAI(
// // // //           prompt,
// // // //           language,
// // // //           framework,
// // // //           includeTests,
// // // //           includeComments,
// // // //           complexity
// // // //         );
// // // //         console.log("AI code generation successful");
// // // //       } catch (error) {
// // // //         console.warn("OpenRouter API failed, using fallback:", error);
// // // //         codeResult = generateCodeFallback(
// // // //           prompt,
// // // //           language,
// // // //           framework,
// // // //           includeTests,
// // // //           includeComments
// // // //         );
// // // //       }
// // // //     } else {
// // // //       console.log("Using fallback (no API key)");
// // // //       codeResult = generateCodeFallback(
// // // //         prompt,
// // // //         language,
// // // //         framework,
// // // //         includeTests,
// // // //         includeComments
// // // //       );
// // // //     }

// // // //     return NextResponse.json({
// // // //       success: true,
// // // //       data: codeResult,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Code generation error:", error);

// // // //     return NextResponse.json(
// // // //       {
// // // //         success: false,
// // // //         error:
// // // //           error instanceof Error ? error.message : "Failed to generate code",
// // // //       },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // // // // Generate code using OpenRouter AI
// // // // async function generateCodeWithAI(
// // // //   prompt: string,
// // // //   language: string,
// // // //   framework: string,
// // // //   includeTests: boolean,
// // // //   includeComments: boolean,
// // // //   complexity: string
// // // // ): Promise<any> {
// // // //   const systemPrompt = `You are an expert software developer and programmer. Generate clean, production-ready code based on user requirements.

// // // // User Request: ${prompt}
// // // // Target Language: ${language}
// // // // ${framework ? `Framework: ${framework}` : ""}
// // // // Complexity: ${complexity}
// // // // Include Tests: ${includeTests}
// // // // Include Comments: ${includeComments}

// // // // Provide a detailed JSON response with this exact structure:
// // // // {
// // // //   "mainCode": {
// // // //     "filename": "appropriate filename with extension",
// // // //     "language": "${language}",
// // // //     "code": "complete, working code with proper syntax",
// // // //     "explanation": "brief explanation of what the code does"
// // // //   },
// // // //   "additionalFiles": [
// // // //     {
// // // //       "filename": "additional-file.ext",
// // // //       "language": "file language",
// // // //       "code": "additional code if needed",
// // // //       "purpose": "why this file is needed"
// // // //     }
// // // //   ],
// // // //   "dependencies": [
// // // //     {
// // // //       "name": "package-name",
// // // //       "version": "^1.0.0",
// // // //       "purpose": "why this dependency is needed"
// // // //     }
// // // //   ],
// // // //   "setup": [
// // // //     "step 1 to set up the code",
// // // //     "step 2 to run the code",
// // // //     "step 3 additional setup if needed"
// // // //   ],
// // // //   "usage": {
// // // //     "description": "how to use this code",
// // // //     "examples": [
// // // //       "example usage 1",
// // // //       "example usage 2"
// // // //     ]
// // // //   },
// // // //   "features": ["feature 1", "feature 2", "feature 3"],
// // // //   "bestPractices": ["practice 1", "practice 2"],
// // // //   "alternatives": [
// // // //     {
// // // //       "approach": "alternative approach name",
// // // //       "description": "why you might use this instead",
// // // //       "code": "brief code example"
// // // //     }
// // // //   ],
// // // //   ${
// // // //     includeTests
// // // //       ? `"tests": {
// // // //     "filename": "test-file.test.js",
// // // //     "code": "complete test code",
// // // //     "framework": "testing framework used"
// // // //   },`
// // // //       : ""
// // // //   }
// // // //   "improvements": ["possible improvement 1", "possible improvement 2"],
// // // //   "resources": [
// // // //     {
// // // //       "title": "Resource Title",
// // // //       "url": "https://example.com",
// // // //       "description": "why this resource is helpful"
// // // //     }
// // // //   ]
// // // // }

// // // // Requirements:
// // // // - Generate complete, functional code that actually works
// // // // - Follow language/framework best practices and conventions
// // // // - Include proper error handling where appropriate
// // // // - Make code readable and maintainable
// // // // - Add ${
// // // //     includeComments
// // // //       ? "comprehensive comments explaining the code"
// // // //       : "minimal comments"
// // // //   }
// // // // - Ensure code is secure and follows modern standards
// // // // - Make it production-ready, not just a basic example`;

// // // //   const response = await openRouterClient.generateCompletion(
// // // //     systemPrompt,
// // // //     config.openrouter.models.advanced
// // // //   );

// // // //   // Extract JSON from response
// // // //   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
// // // //   const jsonString = jsonMatch ? jsonMatch[1] : response;

// // // //   try {
// // // //     const parsed = JSON.parse(jsonString);

// // // //     // Validate required fields
// // // //     if (!parsed.mainCode || !parsed.mainCode.code) {
// // // //       throw new Error("Invalid code structure in AI response");
// // // //     }

// // // //     return {
// // // //       ...parsed,
// // // //       metadata: {
// // // //         generatedAt: new Date().toISOString(),
// // // //         language,
// // // //         framework: framework || null,
// // // //         complexity,
// // // //         includeTests,
// // // //         includeComments,
// // // //       },
// // // //       rawResponse: response,
// // // //     };
// // // //   } catch (error) {
// // // //     console.error("Failed to parse AI response:", error);

// // // //     // Try to extract just the code if JSON parsing fails
// // // //     const codeMatch = response.match(/```(?:\w+)?\s*([\s\S]*?)\s*```/);
// // // //     const extractedCode = codeMatch ? codeMatch[1] : response;

// // // //     return {
// // // //       mainCode: {
// // // //         filename: `generated.${getFileExtension(language)}`,
// // // //         language,
// // // //         code: extractedCode,
// // // //         explanation: "Generated code (AI response parsing failed)",
// // // //       },
// // // //       additionalFiles: [],
// // // //       dependencies: [],
// // // //       setup: ["Run the generated code"],
// // // //       usage: { description: "Use as needed", examples: [] },
// // // //       features: ["Generated functionality"],
// // // //       bestPractices: ["Follow language conventions"],
// // // //       alternatives: [],
// // // //       improvements: ["Optimize as needed"],
// // // //       resources: [],
// // // //       metadata: {
// // // //         generatedAt: new Date().toISOString(),
// // // //         language,
// // // //         framework: framework || null,
// // // //         complexity,
// // // //         includeTests,
// // // //         includeComments,
// // // //         fallback: true,
// // // //       },
// // // //       rawResponse: response,
// // // //     };
// // // //   }
// // // // }

// // // // // Fallback code generator
// // // // function generateCodeFallback(
// // // //   prompt: string,
// // // //   language: string,
// // // //   framework: string,
// // // //   includeTests: boolean,
// // // //   includeComments: boolean
// // // // ): any {
// // // //   const filename = `generated.${getFileExtension(language)}`;
// // // //   const codeTemplate = generateBasicCodeTemplate(
// // // //     prompt,
// // // //     language,
// // // //     framework,
// // // //     includeComments
// // // //   );

// // // //   return {
// // // //     mainCode: {
// // // //       filename,
// // // //       language,
// // // //       code: codeTemplate,
// // // //       explanation: `Basic ${language} code template based on your request: "${prompt}"`,
// // // //     },
// // // //     additionalFiles: framework
// // // //       ? [
// // // //           {
// // // //             filename: getFrameworkConfigFile(framework),
// // // //             language: "json",
// // // //             code: generateFrameworkConfig(framework),
// // // //             purpose: `Configuration file for ${framework}`,
// // // //           },
// // // //         ]
// // // //       : [],
// // // //     dependencies: getBasicDependencies(language, framework),
// // // //     setup: [
// // // //       `1. Save the code as ${filename}`,
// // // //       language === "javascript" || language === "typescript"
// // // //         ? "2. Run: npm install"
// // // //         : "2. Install required dependencies",
// // // //       language === "javascript"
// // // //         ? "3. Run: node " + filename
// // // //         : language === "python"
// // // //         ? "3. Run: python " + filename
// // // //         : language === "java"
// // // //         ? "3. Compile: javac " +
// // // //           filename +
// // // //           " then run: java " +
// // // //           filename.replace(".java", "")
// // // //         : "3. Run the code using appropriate compiler/interpreter",
// // // //     ],
// // // //     usage: {
// // // //       description: `This ${language} code provides basic functionality based on your request`,
// // // //       examples: [
// // // //         "Modify the code to fit your specific needs",
// // // //         "Add error handling and validation as required",
// // // //       ],
// // // //     },
// // // //     features: [
// // // //       "Basic structure and functionality",
// // // //       "Clean code organization",
// // // //       framework ? `Framework: ${framework}` : "Standard library usage",
// // // //     ],
// // // //     bestPractices: [
// // // //       "Add proper error handling",
// // // //       "Include input validation",
// // // //       "Follow security best practices",
// // // //     ],
// // // //     alternatives: [],
// // // //     improvements: [
// // // //       "Add more robust error handling",
// // // //       "Implement logging",
// // // //       "Add input validation",
// // // //       "Optimize performance if needed",
// // // //     ],
// // // //     resources: [
// // // //       {
// // // //         title: `${language} Documentation`,
// // // //         url: getLanguageDocsUrl(language),
// // // //         description: `Official ${language} documentation and reference`,
// // // //       },
// // // //     ],
// // // //     metadata: {
// // // //       generatedAt: new Date().toISOString(),
// // // //       language,
// // // //       framework: framework || null,
// // // //       complexity: "basic",
// // // //       includeTests,
// // // //       includeComments,
// // // //       fallback: true,
// // // //     },
// // // //   };
// // // // }

// // // // // Helper function to get file extension based on language
// // // // function getFileExtension(language: string): string {
// // // //   const extensions: { [key: string]: string } = {
// // // //     javascript: "js",
// // // //     typescript: "ts",
// // // //     python: "py",
// // // //     java: "java",
// // // //     csharp: "cs",
// // // //     cpp: "cpp",
// // // //     c: "c",
// // // //     ruby: "rb",
// // // //     php: "php",
// // // //     go: "go",
// // // //     rust: "rs",
// // // //     swift: "swift",
// // // //     kotlin: "kt",
// // // //     html: "html",
// // // //     css: "css",
// // // //     sql: "sql",
// // // //   };
// // // //   return extensions[language.toLowerCase()] || "txt";
// // // // }

// // // // // Generate basic code template based on language
// // // // function generateBasicCodeTemplate(
// // // //   prompt: string,
// // // //   language: string,
// // // //   framework: string,
// // // //   includeComments: boolean
// // // // ): string {
// // // //   const commentStyle = getCommentStyle(language);

// // // //   let template = "";

// // // //   if (includeComments) {
// // // //     template += `${commentStyle} Generated code based on: ${prompt}\n`;
// // // //     template += `${commentStyle} Language: ${language}\n`;
// // // //     if (framework) template += `${commentStyle} Framework: ${framework}\n`;
// // // //     template += `${commentStyle} This is a basic template - customize as needed\n\n`;
// // // //   }

// // // //   switch (language.toLowerCase()) {
// // // //     case "javascript":
// // // //       if (framework === "react") {
// // // //         template += `import React from 'react';\n\n`;
// // // //         template += `const ${prompt.split(" ")[0] || "Component"} = () => {\n`;
// // // //         template += `  return (\n`;
// // // //         template += `    <div>\n`;
// // // //         template += `      <h1>Hello World</h1>\n`;
// // // //         template += `      {/* Your component code here */}\n`;
// // // //         template += `    </div>\n`;
// // // //         template += `  );\n};\n\n`;
// // // //         template += `export default ${prompt.split(" ")[0] || "Component"};\n`;
// // // //       } else {
// // // //         template += `// ${prompt}\n`;
// // // //         template += `function main() {\n`;
// // // //         template += `  console.log("Hello, World!");\n`;
// // // //         template += `  // Add your code here\n`;
// // // //         template += `}\n\n`;
// // // //         template += `main();\n`;
// // // //       }
// // // //       break;

// // // //     case "python":
// // // //       template += `def main():\n`;
// // // //       template += `    print("Hello, World!")\n`;
// // // //       template += `    # ${prompt}\n`;
// // // //       template += `    # Add your code here\n\n`;
// // // //       template += `if __name__ == "__main__":\n`;
// // // //       template += `    main()\n`;
// // // //       break;

// // // //     case "java":
// // // //       const className = prompt.split(" ")[0] || "Main";
// // // //       template += `public class ${className} {\n`;
// // // //       template += `    public static void main(String[] args) {\n`;
// // // //       template += `        System.out.println("Hello, World!");\n`;
// // // //       template += `        // ${prompt}\n`;
// // // //       template += `    }\n`;
// // // //       template += `}\n`;
// // // //       break;

// // // //     default:
// // // //       template += `// ${language} code for: ${prompt}\n`;
// // // //       template += `// Basic template - implement your specific logic\n`;
// // // //   }

// // // //   return template;
// // // // }

// // // // // Get comment style for different languages
// // // // function getCommentStyle(language: string): string {
// // // //   const styles: { [key: string]: string } = {
// // // //     javascript: "//",
// // // //     typescript: "//",
// // // //     python: "#",
// // // //     java: "//",
// // // //     csharp: "//",
// // // //     cpp: "//",
// // // //     c: "//",
// // // //     ruby: "#",
// // // //     php: "//",
// // // //     go: "//",
// // // //     rust: "//",
// // // //     swift: "//",
// // // //     kotlin: "//",
// // // //     html: "<!--",
// // // //     css: "/*",
// // // //   };
// // // //   return styles[language.toLowerCase()] || "//";
// // // // }

// // // // // Get framework configuration filename
// // // // function getFrameworkConfigFile(framework: string): string {
// // // //   const configFiles: { [key: string]: string } = {
// // // //     react: "package.json",
// // // //     vue: "package.json",
// // // //     angular: "package.json",
// // // //     nextjs: "package.json",
// // // //     express: "package.json",
// // // //     django: "requirements.txt",
// // // //     flask: "requirements.txt",
// // // //     spring: "pom.xml",
// // // //     laravel: "composer.json",
// // // //   };
// // // //   return configFiles[framework.toLowerCase()] || "config.json";
// // // // }

// // // // // Generate basic framework configuration
// // // // function generateFrameworkConfig(framework: string): string {
// // // //   switch (framework.toLowerCase()) {
// // // //     case "react":
// // // //       return `{
// // // //   "name": "react-app",
// // // //   "version": "1.0.0",
// // // //   "dependencies": {
// // // //     "react": "^18.2.0",
// // // //     "react-dom": "^18.2.0"
// // // //   },
// // // //   "scripts": {
// // // //     "start": "react-scripts start",
// // // //     "build": "react-scripts build"
// // // //   }
// // // // }`;

// // // //     case "express":
// // // //       return `{
// // // //   "name": "express-app",
// // // //   "version": "1.0.0",
// // // //   "dependencies": {
// // // //     "express": "^4.18.0"
// // // //   },
// // // //   "scripts": {
// // // //     "start": "node server.js"
// // // //   }
// // // // }`;

// // // //     default:
// // // //       return `{
// // // //   "name": "${framework}-app",
// // // //   "version": "1.0.0",
// // // //   "dependencies": {}
// // // // }`;
// // // //   }
// // // // }

// // // // // Get basic dependencies for language/framework
// // // // function getBasicDependencies(language: string, framework: string): any[] {
// // // //   const deps: any[] = [];

// // // //   if (framework) {
// // // //     switch (framework.toLowerCase()) {
// // // //       case "react":
// // // //         deps.push({
// // // //           name: "react",
// // // //           version: "^18.2.0",
// // // //           purpose: "UI framework",
// // // //         });
// // // //         deps.push({
// // // //           name: "react-dom",
// // // //           version: "^18.2.0",
// // // //           purpose: "DOM rendering",
// // // //         });
// // // //         break;
// // // //       case "express":
// // // //         deps.push({
// // // //           name: "express",
// // // //           version: "^4.18.0",
// // // //           purpose: "Web framework",
// // // //         });
// // // //         break;
// // // //     }
// // // //   }

// // // //   if (language === "typescript") {
// // // //     deps.push({
// // // //       name: "typescript",
// // // //       version: "^5.0.0",
// // // //       purpose: "TypeScript compiler",
// // // //     });
// // // //   }

// // // //   return deps;
// // // // }

// // // // // Get language documentation URL
// // // // function getLanguageDocsUrl(language: string): string {
// // // //   const docs: { [key: string]: string } = {
// // // //     javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
// // // //     typescript: "https://www.typescriptlang.org/docs",
// // // //     python: "https://docs.python.org",
// // // //     java: "https://docs.oracle.com/javase",
// // // //     csharp: "https://docs.microsoft.com/dotnet/csharp",
// // // //     cpp: "https://en.cppreference.com",
// // // //     go: "https://golang.org/doc",
// // // //     rust: "https://doc.rust-lang.org",
// // // //   };
// // // //   return docs[language.toLowerCase()] || "https://example.com";
// // // // }

// // // // app/api/code/route.ts
// // // import { NextRequest, NextResponse } from "next/server";
// // // import { validateConfig, config } from "@/lib/config";
// // // import { openRouterClient, rateLimiter } from "@/lib/api-clients";

// // // // Validate config on startup
// // // try {
// // //   validateConfig();
// // // } catch (error) {
// // //   console.error("Configuration validation failed:", error);
// // // }

// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     console.log("Code generation API called");

// // //     // Rate limiting
// // //     const clientIp =
// // //       request.headers.get("x-forwarded-for") ||
// // //       request.headers.get("x-real-ip") ||
// // //       "unknown";

// // //     if (!rateLimiter.isAllowed(`code:${clientIp}`, config.rateLimit.guidance)) {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error: "Rate limit exceeded. Please try again later.",
// // //         },
// // //         { status: 429 }
// // //       );
// // //     }

// // //     // Parse request body
// // //     const body = await request.json();
// // //     const {
// // //       prompt,
// // //       language = "javascript",
// // //       framework = "",
// // //       includeTests = false,
// // //       includeComments = true,
// // //       complexity = "medium",
// // //     } = body;

// // //     if (!prompt || typeof prompt !== "string") {
// // //       return NextResponse.json(
// // //         { success: false, error: "Code prompt is required" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     if (prompt.length < 5) {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error:
// // //             "Prompt too short. Please provide more details about the code you want.",
// // //         },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     console.log("Generating code for:", prompt.substring(0, 100) + "...");

// // //     let codeResult;

// // //     if (config.openrouter.apiKey) {
// // //       try {
// // //         codeResult = await generateCodeWithAI(
// // //           prompt,
// // //           language,
// // //           framework,
// // //           includeTests,
// // //           includeComments,
// // //           complexity
// // //         );
// // //         console.log("AI code generation successful");
// // //       } catch (error) {
// // //         console.warn("OpenRouter API failed, using fallback:", error);
// // //         codeResult = generateCodeFallback(
// // //           prompt,
// // //           language,
// // //           framework,
// // //           includeTests,
// // //           includeComments
// // //         );
// // //       }
// // //     } else {
// // //       console.log("Using fallback (no API key)");
// // //       codeResult = generateCodeFallback(
// // //         prompt,
// // //         language,
// // //         framework,
// // //         includeTests,
// // //         includeComments
// // //       );
// // //     }

// // //     return NextResponse.json({
// // //       success: true,
// // //       data: codeResult,
// // //     });
// // //   } catch (error) {
// // //     console.error("Code generation error:", error);

// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         error:
// // //           error instanceof Error ? error.message : "Failed to generate code",
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // // Generate code using OpenRouter AI
// // // async function generateCodeWithAI(
// // //   prompt: string,
// // //   language: string,
// // //   framework: string,
// // //   includeTests: boolean,
// // //   includeComments: boolean,
// // //   complexity: string
// // // ): Promise<any> {
// // //   const systemPrompt = `You are an expert software developer and programmer. Generate clean, production-ready code based on user requirements.

// // // User Request: ${prompt}
// // // Target Language: ${language}
// // // ${framework ? `Framework: ${framework}` : ""}
// // // Complexity: ${complexity}
// // // Include Tests: ${includeTests}
// // // Include Comments: ${includeComments}

// // // Provide a detailed JSON response with this exact structure:
// // // {
// // //   "mainCode": {
// // //     "filename": "appropriate filename with extension",
// // //     "language": "${language}",
// // //     "code": "complete, working code with proper syntax",
// // //     "explanation": "brief explanation of what the code does"
// // //   },
// // //   "additionalFiles": [
// // //     {
// // //       "filename": "additional-file.ext",
// // //       "language": "file language",
// // //       "code": "additional code if needed",
// // //       "purpose": "why this file is needed"
// // //     }
// // //   ],
// // //   "dependencies": [
// // //     {
// // //       "name": "package-name",
// // //       "version": "^1.0.0",
// // //       "purpose": "why this dependency is needed"
// // //     }
// // //   ],
// // //   "setup": [
// // //     "step 1 to set up the code",
// // //     "step 2 to run the code",
// // //     "step 3 additional setup if needed"
// // //   ],
// // //   "usage": {
// // //     "description": "how to use this code",
// // //     "examples": [
// // //       "example usage 1",
// // //       "example usage 2"
// // //     ]
// // //   },
// // //   "features": ["feature 1", "feature 2", "feature 3"],
// // //   "bestPractices": ["practice 1", "practice 2"],
// // //   "alternatives": [
// // //     {
// // //       "approach": "alternative approach name",
// // //       "description": "why you might use this instead",
// // //       "code": "brief code example"
// // //     }
// // //   ],
// // //   ${
// // //     includeTests
// // //       ? `"tests": {
// // //     "filename": "test-file.test.js",
// // //     "code": "complete test code",
// // //     "framework": "testing framework used"
// // //   },`
// // //       : ""
// // //   }
// // //   "improvements": ["possible improvement 1", "possible improvement 2"],
// // //   "resources": [
// // //     {
// // //       "title": "Resource Title",
// // //       "url": "https://example.com",
// // //       "description": "why this resource is helpful"
// // //     }
// // //   ]
// // // }

// // // Requirements:
// // // - Generate complete, functional code that actually works
// // // - Follow language/framework best practices and conventions
// // // - Include proper error handling where appropriate
// // // - Make code readable and maintainable
// // // - Add ${
// // //     includeComments
// // //       ? "comprehensive comments explaining the code"
// // //       : "minimal comments"
// // //   }
// // // - Ensure code is secure and follows modern standards
// // // - Make it production-ready, not just a basic example`;

// // //   const response = await openRouterClient.generateCompletion(
// // //     systemPrompt,
// // //     config.openrouter.models.advanced
// // //   );

// // //   // Extract JSON from response
// // //   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
// // //   const jsonString = jsonMatch ? jsonMatch[1] : response;

// // //   try {
// // //     const parsed = JSON.parse(jsonString);

// // //     // Validate required fields
// // //     if (!parsed.mainCode || !parsed.mainCode.code) {
// // //       throw new Error("Invalid code structure in AI response");
// // //     }

// // //     return {
// // //       ...parsed,
// // //       metadata: {
// // //         generatedAt: new Date().toISOString(),
// // //         language,
// // //         framework: framework || null,
// // //         complexity,
// // //         includeTests,
// // //         includeComments,
// // //       },
// // //       rawResponse: response,
// // //     };
// // //   } catch (error) {
// // //     console.error("Failed to parse AI response:", error);

// // //     // Try to extract just the code if JSON parsing fails
// // //     const codeMatch = response.match(/```(?:\w+)?\s*([\s\S]*?)\s*```/);
// // //     const extractedCode = codeMatch ? codeMatch[1] : response;

// // //     return {
// // //       mainCode: {
// // //         filename: `generated.${getFileExtension(language)}`,
// // //         language,
// // //         code: extractedCode,
// // //         explanation: "Generated code (AI response parsing failed)",
// // //       },
// // //       additionalFiles: [],
// // //       dependencies: [],
// // //       setup: ["Run the generated code"],
// // //       usage: { description: "Use as needed", examples: [] },
// // //       features: ["Generated functionality"],
// // //       bestPractices: ["Follow language conventions"],
// // //       alternatives: [],
// // //       improvements: ["Optimize as needed"],
// // //       resources: [],
// // //       metadata: {
// // //         generatedAt: new Date().toISOString(),
// // //         language,
// // //         framework: framework || null,
// // //         complexity,
// // //         includeTests,
// // //         includeComments,
// // //         fallback: true,
// // //       },
// // //       rawResponse: response,
// // //     };
// // //   }
// // // }

// // // // Fallback code generator
// // // function generateCodeFallback(
// // //   prompt: string,
// // //   language: string,
// // //   framework: string,
// // //   includeTests: boolean,
// // //   includeComments: boolean
// // // ): any {
// // //   const filename = `generated.${getFileExtension(language)}`;
// // //   const codeTemplate = generateBasicCodeTemplate(
// // //     prompt,
// // //     language,
// // //     framework,
// // //     includeComments
// // //   );

// // //   return {
// // //     mainCode: {
// // //       filename,
// // //       language,
// // //       code: codeTemplate,
// // //       explanation: `Basic ${language} code template based on your request: "${prompt}"`,
// // //     },
// // //     additionalFiles: framework
// // //       ? [
// // //           {
// // //             filename: getFrameworkConfigFile(framework),
// // //             language: "json",
// // //             code: generateFrameworkConfig(framework),
// // //             purpose: `Configuration file for ${framework}`,
// // //           },
// // //         ]
// // //       : [],
// // //     dependencies: getBasicDependencies(language, framework),
// // //     setup: [
// // //       `1. Save the code as ${filename}`,
// // //       language === "javascript" || language === "typescript"
// // //         ? "2. Run: npm install"
// // //         : "2. Install required dependencies",
// // //       language === "javascript"
// // //         ? "3. Run: node " + filename
// // //         : language === "python"
// // //         ? "3. Run: python " + filename
// // //         : language === "java"
// // //         ? "3. Compile: javac " +
// // //           filename +
// // //           " then run: java " +
// // //           filename.replace(".java", "")
// // //         : "3. Run the code using appropriate compiler/interpreter",
// // //     ],
// // //     usage: {
// // //       description: `This ${language} code provides basic functionality based on your request`,
// // //       examples: [
// // //         "Modify the code to fit your specific needs",
// // //         "Add error handling and validation as required",
// // //       ],
// // //     },
// // //     features: [
// // //       "Basic structure and functionality",
// // //       "Clean code organization",
// // //       framework ? `Framework: ${framework}` : "Standard library usage",
// // //     ],
// // //     bestPractices: [
// // //       "Add proper error handling",
// // //       "Include input validation",
// // //       "Follow security best practices",
// // //     ],
// // //     alternatives: [],
// // //     improvements: [
// // //       "Add more robust error handling",
// // //       "Implement logging",
// // //       "Add input validation",
// // //       "Optimize performance if needed",
// // //     ],
// // //     resources: [
// // //       {
// // //         title: `${language} Documentation`,
// // //         url: getLanguageDocsUrl(language),
// // //         description: `Official ${language} documentation and reference`,
// // //       },
// // //     ],
// // //     metadata: {
// // //       generatedAt: new Date().toISOString(),
// // //       language,
// // //       framework: framework || null,
// // //       complexity: "basic",
// // //       includeTests,
// // //       includeComments,
// // //       fallback: true,
// // //     },
// // //   };
// // // }

// // // // Helper function to get file extension based on language
// // // function getFileExtension(language: string): string {
// // //   const extensions: { [key: string]: string } = {
// // //     javascript: "js",
// // //     typescript: "ts",
// // //     python: "py",
// // //     java: "java",
// // //     csharp: "cs",
// // //     cpp: "cpp",
// // //     c: "c",
// // //     ruby: "rb",
// // //     php: "php",
// // //     go: "go",
// // //     rust: "rs",
// // //     swift: "swift",
// // //     kotlin: "kt",
// // //     html: "html",
// // //     css: "css",
// // //     sql: "sql",
// // //   };
// // //   return extensions[language.toLowerCase()] || "txt";
// // // }

// // // // Generate basic code template based on language
// // // function generateBasicCodeTemplate(
// // //   prompt: string,
// // //   language: string,
// // //   framework: string,
// // //   includeComments: boolean
// // // ): string {
// // //   const commentStyle = getCommentStyle(language);

// // //   let template = "";

// // //   if (includeComments) {
// // //     template += `${commentStyle} Generated code based on: ${prompt}\n`;
// // //     template += `${commentStyle} Language: ${language}\n`;
// // //     if (framework) template += `${commentStyle} Framework: ${framework}\n`;
// // //     template += `${commentStyle} This is a basic template - customize as needed\n\n`;
// // //   }

// // //   switch (language.toLowerCase()) {
// // //     case "javascript":
// // //       if (framework === "react") {
// // //         template += `import React from 'react';\n\n`;
// // //         template += `const ${prompt.split(" ")[0] || "Component"} = () => {\n`;
// // //         template += `  return (\n`;
// // //         template += `    <div>\n`;
// // //         template += `      <h1>Hello World</h1>\n`;
// // //         template += `      {/* Your component code here */}\n`;
// // //         template += `    </div>\n`;
// // //         template += `  );\n};\n\n`;
// // //         template += `export default ${prompt.split(" ")[0] || "Component"};\n`;
// // //       } else {
// // //         template += `// ${prompt}\n`;
// // //         template += `function main() {\n`;
// // //         template += `  console.log("Hello, World!");\n`;
// // //         template += `  // Add your code here\n`;
// // //         template += `}\n\n`;
// // //         template += `main();\n`;
// // //       }
// // //       break;

// // //     case "python":
// // //       template += `def main():\n`;
// // //       template += `    print("Hello, World!")\n`;
// // //       template += `    # ${prompt}\n`;
// // //       template += `    # Add your code here\n\n`;
// // //       template += `if __name__ == "__main__":\n`;
// // //       template += `    main()\n`;
// // //       break;

// // //     case "java":
// // //       const className = prompt.split(" ")[0] || "Main";
// // //       template += `public class ${className} {\n`;
// // //       template += `    public static void main(String[] args) {\n`;
// // //       template += `        System.out.println("Hello, World!");\n`;
// // //       template += `        // ${prompt}\n`;
// // //       template += `    }\n`;
// // //       template += `}\n`;
// // //       break;

// // //     default:
// // //       template += `// ${language} code for: ${prompt}\n`;
// // //       template += `// Basic template - implement your specific logic\n`;
// // //   }

// // //   return template;
// // // }

// // // // Get comment style for different languages
// // // function getCommentStyle(language: string): string {
// // //   const styles: { [key: string]: string } = {
// // //     javascript: "//",
// // //     typescript: "//",
// // //     python: "#",
// // //     java: "//",
// // //     csharp: "//",
// // //     cpp: "//",
// // //     c: "//",
// // //     ruby: "#",
// // //     php: "//",
// // //     go: "//",
// // //     rust: "//",
// // //     swift: "//",
// // //     kotlin: "//",
// // //     html: "<!--",
// // //     css: "/*",
// // //   };
// // //   return styles[language.toLowerCase()] || "//";
// // // }

// // // // Get framework configuration filename
// // // function getFrameworkConfigFile(framework: string): string {
// // //   const configFiles: { [key: string]: string } = {
// // //     react: "package.json",
// // //     vue: "package.json",
// // //     angular: "package.json",
// // //     nextjs: "package.json",
// // //     express: "package.json",
// // //     django: "requirements.txt",
// // //     flask: "requirements.txt",
// // //     spring: "pom.xml",
// // //     laravel: "composer.json",
// // //   };
// // //   return configFiles[framework.toLowerCase()] || "config.json";
// // // }

// // // // Generate basic framework configuration
// // // function generateFrameworkConfig(framework: string): string {
// // //   switch (framework.toLowerCase()) {
// // //     case "react":
// // //       return `{
// // //   "name": "react-app",
// // //   "version": "1.0.0",
// // //   "dependencies": {
// // //     "react": "^18.2.0",
// // //     "react-dom": "^18.2.0"
// // //   },
// // //   "scripts": {
// // //     "start": "react-scripts start",
// // //     "build": "react-scripts build"
// // //   }
// // // }`;

// // //     case "express":
// // //       return `{
// // //   "name": "express-app",
// // //   "version": "1.0.0",
// // //   "dependencies": {
// // //     "express": "^4.18.0"
// // //   },
// // //   "scripts": {
// // //     "start": "node server.js"
// // //   }
// // // }`;

// // //     default:
// // //       return `{
// // //   "name": "${framework}-app",
// // //   "version": "1.0.0",
// // //   "dependencies": {}
// // // }`;
// // //   }
// // // }

// // // // Get basic dependencies for language/framework
// // // function getBasicDependencies(language: string, framework: string): any[] {
// // //   const deps: any[] = [];

// // //   if (framework) {
// // //     switch (framework.toLowerCase()) {
// // //       case "react":
// // //         deps.push({
// // //           name: "react",
// // //           version: "^18.2.0",
// // //           purpose: "UI framework",
// // //         });
// // //         deps.push({
// // //           name: "react-dom",
// // //           version: "^18.2.0",
// // //           purpose: "DOM rendering",
// // //         });
// // //         break;
// // //       case "express":
// // //         deps.push({
// // //           name: "express",
// // //           version: "^4.18.0",
// // //           purpose: "Web framework",
// // //         });
// // //         break;
// // //     }
// // //   }

// // //   if (language === "typescript") {
// // //     deps.push({
// // //       name: "typescript",
// // //       version: "^5.0.0",
// // //       purpose: "TypeScript compiler",
// // //     });
// // //   }

// // //   return deps;
// // // }

// // // // Get language documentation URL
// // // function getLanguageDocsUrl(language: string): string {
// // //   const docs: { [key: string]: string } = {
// // //     javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
// // //     typescript: "https://www.typescriptlang.org/docs",
// // //     python: "https://docs.python.org",
// // //     java: "https://docs.oracle.com/javase",
// // //     csharp: "https://docs.microsoft.com/dotnet/csharp",
// // //     cpp: "https://en.cppreference.com",
// // //     go: "https://golang.org/doc",
// // //     rust: "https://doc.rust-lang.org",
// // //   };
// // //   return docs[language.toLowerCase()] || "https://example.com";
// // // }

// // // export async function GET() {
// // //   return NextResponse.json(
// // //     { success: false, error: "Method not allowed" },
// // //     { status: 405 }
// // //   );
// // // }

// // // app/api/code/route.ts
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
// //     console.log("Code generation API called");

// //     const clientIp =
// //       request.headers.get("x-forwarded-for") ||
// //       request.headers.get("x-real-ip") ||
// //       "unknown";

// //     if (!rateLimiter.isAllowed(`code:${clientIp}`, config.rateLimit.guidance)) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Rate limit exceeded. Please try again later.",
// //         },
// //         { status: 429 }
// //       );
// //     }

// //     const body = await request.json();
// //     const {
// //       prompt,
// //       language = "typescript",
// //       framework = "react",
// //       includeTests = false,
// //       includeComments = true,
// //     } = body;

// //     if (!prompt || typeof prompt !== "string") {
// //       return NextResponse.json(
// //         { success: false, error: "Code prompt is required" },
// //         { status: 400 }
// //       );
// //     }

// //     if (prompt.length < 5) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Prompt too short. Please describe what code you need.",
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     console.log("Generating code for:", prompt.substring(0, 100) + "...");

// //     let codeResult;

// //     if (config.openrouter.apiKey) {
// //       try {
// //         codeResult = await generateCodeWithAI(
// //           prompt,
// //           language,
// //           framework,
// //           includeTests,
// //           includeComments
// //         );
// //         console.log("AI code generation successful");
// //       } catch (error) {
// //         console.warn("OpenRouter API failed, using fallback:", error);
// //         codeResult = generateCodeFallback(prompt, language, framework);
// //       }
// //     } else {
// //       console.log("Using fallback (no API key)");
// //       codeResult = generateCodeFallback(prompt, language, framework);
// //     }

// //     return NextResponse.json({
// //       success: true,
// //       data: codeResult,
// //     });
// //   } catch (error) {
// //     console.error("Code generation error:", error);
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error:
// //           error instanceof Error ? error.message : "Failed to generate code",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // async function generateCodeWithAI(
// //   prompt: string,
// //   language: string,
// //   framework: string,
// //   includeTests: boolean,
// //   includeComments: boolean
// // ): Promise<any> {
// //   const systemPrompt = `You are an expert software developer. Generate clean, production-ready code based on user requirements.

// // User Request: ${prompt}
// // Language: ${language}
// // Framework: ${framework}
// // Include Tests: ${includeTests}
// // Include Comments: ${includeComments}

// // Provide a detailed JSON response with this EXACT structure:
// // {
// //   "title": "Clear title for this code",
// //   "description": "Brief description of what this code does",
// //   "mainCode": {
// //     "filename": "ComponentName.${language === "typescript" ? "tsx" : "jsx"}",
// //     "language": "${language}",
// //     "code": "// Complete, working, production-ready code\n// with proper imports and exports",
// //     "explanation": "Detailed explanation of how the code works"
// //   },
// //   "additionalFiles": [
// //     {
// //       "filename": "types.ts",
// //       "language": "typescript",
// //       "code": "// Type definitions",
// //       "purpose": "Type definitions for the component"
// //     }
// //   ],
// //   "styling": {
// //     "filename": "styles.css",
// //     "code": "/* CSS styles */",
// //     "approach": "CSS Modules | Tailwind | Styled Components"
// //   },
// //   "dependencies": [
// //     {
// //       "name": "package-name",
// //       "version": "^1.0.0",
// //       "purpose": "Why this dependency is needed"
// //     }
// //   ],
// //   "installation": {
// //     "commands": ["npm install package-name"],
// //     "notes": "Additional setup instructions if needed"
// //   },
// //   "usage": {
// //     "description": "How to use this code in your project",
// //     "example": "// Import and use example\nimport Component from './Component';\n\n<Component prop='value' />"
// //   },
// //   "features": [
// //     "Feature 1 - description",
// //     "Feature 2 - description",
// //     "Feature 3 - description"
// //   ],
// //   "props": [
// //     {
// //       "name": "propName",
// //       "type": "string | number | boolean",
// //       "required": true,
// //       "description": "What this prop does"
// //     }
// //   ],
// //   ${
// //     includeTests
// //       ? `"tests": {
// //     "filename": "Component.test.tsx",
// //     "code": "// Complete test code with test cases",
// //     "framework": "Jest | Vitest | React Testing Library"
// //   },`
// //       : ""
// //   }
// //   "bestPractices": [
// //     "Best practice 1",
// //     "Best practice 2"
// //   ],
// //   "accessibility": [
// //     "Accessibility consideration 1",
// //     "Accessibility consideration 2"
// //   ],
// //   "performance": [
// //     "Performance tip 1",
// //     "Performance tip 2"
// //   ],
// //   "alternatives": [
// //     {
// //       "title": "Alternative approach",
// //       "description": "When to use this alternative"
// //     }
// //   ]
// // }

// // IMPORTANT: Generate ONLY working, production-ready code. No placeholders, no "// TODO", no incomplete implementations.`;

// //   const response = await openRouterClient.generateCompletion(
// //     systemPrompt,
// //     config.openrouter.models.advanced
// //   );

// //   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
// //   const jsonString = jsonMatch ? jsonMatch[1] : response;

// //   try {
// //     const parsed = JSON.parse(jsonString);

// //     if (!parsed.mainCode || !parsed.mainCode.code) {
// //       throw new Error("Invalid code structure in AI response");
// //     }

// //     return {
// //       ...parsed,
// //       metadata: {
// //         generatedAt: new Date().toISOString(),
// //         language,
// //         framework,
// //         includeTests,
// //         includeComments,
// //       },
// //       rawResponse: response,
// //     };
// //   } catch (error) {
// //     console.error("Failed to parse AI response:", error);

// //     const codeMatch = response.match(/```(?:\w+)?\s*([\s\S]*?)\s*```/);
// //     const extractedCode = codeMatch ? codeMatch[1] : response;

// //     return {
// //       title: "Generated Code",
// //       description: prompt,
// //       mainCode: {
// //         filename: `Component.${language === "typescript" ? "tsx" : "jsx"}`,
// //         language,
// //         code: extractedCode,
// //         explanation: "Generated code based on your request",
// //       },
// //       additionalFiles: [],
// //       dependencies: [],
// //       usage: { description: "Use this code in your project", example: "" },
// //       features: ["Generated functionality"],
// //       metadata: {
// //         generatedAt: new Date().toISOString(),
// //         language,
// //         framework,
// //         includeTests,
// //         includeComments,
// //         fallback: true,
// //       },
// //       rawResponse: response,
// //     };
// //   }
// // }

// // function generateCodeFallback(
// //   prompt: string,
// //   language: string,
// //   framework: string
// // ): any {
// //   const extension = language === "typescript" ? "tsx" : "jsx";
// //   const isReact = framework.toLowerCase().includes("react");

// //   const codeTemplate = isReact
// //     ? `import React from 'react';

// // interface ${prompt.split(" ")[0] || "Component"}Props {
// //   // Define your props here
// // }

// // const ${prompt.split(" ")[0] || "Component"}: React.FC<${
// //         prompt.split(" ")[0] || "Component"
// //       }Props> = (props) => {
// //   return (
// //     <div>
// //       <h1>Your Component</h1>
// //       {/* ${prompt} */}
// //       <p>Implement your component logic here</p>
// //     </div>
// //   );
// // };

// // export default ${prompt.split(" ")[0] || "Component"};`
// //     : `// ${prompt}
// // function main() {
// //   console.log('Your code implementation here');
// //   // Add your logic
// // }

// // export default main;`;

// //   return {
// //     title: `${framework} ${language} Code`,
// //     description: prompt,
// //     mainCode: {
// //       filename: `Component.${extension}`,
// //       language,
// //       code: codeTemplate,
// //       explanation: `Basic ${framework} component template. Customize based on your needs.`,
// //     },
// //     additionalFiles: [],
// //     styling: isReact
// //       ? {
// //           filename: "Component.module.css",
// //           code: `.container {\n  padding: 1rem;\n}\n\n.title {\n  font-size: 1.5rem;\n  font-weight: bold;\n}`,
// //           approach: "CSS Modules",
// //         }
// //       : null,
// //     dependencies: isReact
// //       ? [
// //           {
// //             name: "react",
// //             version: "^18.2.0",
// //             purpose: "React library",
// //           },
// //         ]
// //       : [],
// //     installation: {
// //       commands: isReact ? ["npm install react react-dom"] : [],
// //       notes: "Install required dependencies",
// //     },
// //     usage: {
// //       description: "Import and use this component in your application",
// //       example: `import Component from './Component';\n\n<Component />`,
// //     },
// //     features: ["Basic functionality", "Customizable template"],
// //     props: [],
// //     bestPractices: [
// //       "Add proper TypeScript types",
// //       "Include error handling",
// //       "Write unit tests",
// //     ],
// //     accessibility: ["Add ARIA labels", "Ensure keyboard navigation"],
// //     performance: ["Use React.memo for optimization", "Lazy load if needed"],
// //     alternatives: [],
// //     metadata: {
// //       generatedAt: new Date().toISOString(),
// //       language,
// //       framework,
// //       includeTests: false,
// //       includeComments: true,
// //       fallback: true,
// //     },
// //   };
// // }

// // export async function GET() {
// //   return NextResponse.json(
// //     { success: false, error: "Method not allowed" },
// //     { status: 405 }
// //   );
// // }

// // app/api/code/route.ts
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
//     console.log("Code generation API called");

//     const clientIp =
//       request.headers.get("x-forwarded-for") ||
//       request.headers.get("x-real-ip") ||
//       "unknown";

//     if (!rateLimiter.isAllowed(`code:${clientIp}`, config.rateLimit.guidance)) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Rate limit exceeded. Please try again later.",
//         },
//         { status: 429 }
//       );
//     }

//     const body = await request.json();
//     const {
//       prompt,
//       language = "typescript",
//       framework = "react",
//       includeTests = false,
//       includeComments = true,
//     } = body;

//     if (!prompt || typeof prompt !== "string") {
//       return NextResponse.json(
//         { success: false, error: "Code prompt is required" },
//         { status: 400 }
//       );
//     }

//     if (prompt.length < 5) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Prompt too short. Please describe what code you need.",
//         },
//         { status: 400 }
//       );
//     }

//     console.log("Generating code for:", prompt.substring(0, 100) + "...");

//     let codeResult;

//     if (config.openrouter.apiKey) {
//       try {
//         codeResult = await generateCodeWithAI(
//           prompt,
//           language,
//           framework,
//           includeTests,
//           includeComments
//         );
//         console.log("AI code generation successful");
//       } catch (error) {
//         console.warn("OpenRouter API failed, using fallback:", error);
//         codeResult = generateCodeFallback(prompt, language, framework);
//       }
//     } else {
//       console.log("Using fallback (no API key)");
//       codeResult = generateCodeFallback(prompt, language, framework);
//     }

//     return NextResponse.json({
//       success: true,
//       data: codeResult,
//     });
//   } catch (error) {
//     console.error("Code generation error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error ? error.message : "Failed to generate code",
//       },
//       { status: 500 }
//     );
//   }
// }

// async function generateCodeWithAI(
//   prompt: string,
//   language: string,
//   framework: string,
//   includeTests: boolean,
//   includeComments: boolean
// ): Promise<any> {
//   const systemPrompt = `You are an expert software developer and programming teacher. Generate clean, production-ready code with DETAILED EDUCATIONAL EXPLANATIONS.

// User Request: ${prompt}
// Language: ${language}
// Framework: ${framework}
// Include Tests: ${includeTests}
// Include Comments: ${includeComments}

// Your mission: Don't just give code - TEACH through code. Explain every part like you're mentoring a junior developer.

// Provide a detailed JSON response with this EXACT structure:

// {
//   "title": "Clear title for this code (e.g., 'React Login Form Component')",
//   "description": "Brief description of what this code does and why it's useful",
//   "overview": {
//     "purpose": "What problem this solves",
//     "approach": "High-level strategy used",
//     "complexity": "Simple/Medium/Complex",
//     "learningValue": "What developer will learn from this"
//   },
//   "mainCode": {
//     "filename": "ComponentName.${language === "typescript" ? "tsx" : "jsx"}",
//     "language": "${language}",
//     "code": "// Complete, working, production-ready code\n// with detailed inline comments explaining WHAT and WHY",
//     "lineByLineExplanation": [
//       {
//         "lines": "1-3",
//         "code": "import React, { useState } from 'react';",
//         "what": "Importing React library and useState hook",
//         "why": "We need React to create components and useState to manage form input changes",
//         "analogy": "Like importing tools from a toolbox - React is the main tool, useState is a specific tool for remembering things"
//       }
//     ],
//     "keyConceptsUsed": [
//       {
//         "concept": "React Hooks (useState)",
//         "explanation": "Hooks let you use state in functional components",
//         "analogy": "Think of useState like a notepad where React writes down and remembers information for you",
//         "moreInfo": "useState returns [currentValue, functionToUpdateIt]"
//       }
//     ]
//   },
//   "codeBreakdown": {
//     "sections": [
//       {
//         "title": "Imports Section",
//         "purpose": "Bringing in necessary tools and libraries",
//         "explanation": "Detailed explanation of what's imported and why",
//         "analogy": "Like gathering ingredients before cooking"
//       },
//       {
//         "title": "State Management",
//         "purpose": "Managing component data",
//         "explanation": "How and why we track changing data",
//         "analogy": "Like having a whiteboard to write temporary notes"
//       },
//       {
//         "title": "Event Handlers",
//         "purpose": "Responding to user actions",
//         "explanation": "What happens when user interacts",
//         "analogy": "Like setting up 'if someone presses this button, do that' rules"
//       },
//       {
//         "title": "JSX Return",
//         "purpose": "What user sees on screen",
//         "explanation": "The HTML-like code that becomes the UI",
//         "analogy": "The blueprint for what appears on screen"
//       }
//     ]
//   },
//   "additionalFiles": [
//     {
//       "filename": "types.ts",
//       "language": "typescript",
//       "code": "// Type definitions with comments",
//       "purpose": "Type definitions for type safety",
//       "explanation": "Why we need these types and how they prevent bugs"
//     }
//   ],
//   "styling": {
//     "filename": "styles.css",
//     "code": "/* CSS styles with explanatory comments */",
//     "approach": "CSS Modules | Tailwind | Styled Components",
//     "explanation": "Why this styling approach was chosen",
//     "keyConcepts": [
//       {
//         "concept": "Flexbox layout",
//         "why": "Makes responsive layouts easier",
//         "analogy": "Like organizing books on a shelf that auto-adjusts"
//       }
//     ]
//   },
//   "dependencies": [
//     {
//       "name": "package-name",
//       "version": "^1.0.0",
//       "purpose": "Why this dependency is needed",
//       "whatItDoes": "Detailed explanation of what this package provides",
//       "alternatives": "Other options you could use instead"
//     }
//   ],
//   "installation": {
//     "commands": ["npm install package-name"],
//     "notes": "Additional setup instructions",
//     "explanation": "What these commands do step by step"
//   },
//   "usage": {
//     "description": "How to use this code in your project",
//     "example": "// Import and use example\nimport Component from './Component';\n\n<Component prop='value' />",
//     "explanation": "Step-by-step guide to integrating this code",
//     "commonScenarios": [
//       {
//         "scenario": "When to use this component",
//         "implementation": "How to implement in that scenario"
//       }
//     ]
//   },
//   "features": [
//     {
//       "feature": "Feature name",
//       "description": "What it does",
//       "codeLocation": "Where in code this is implemented",
//       "howItWorks": "Step-by-step breakdown"
//     }
//   ],
//   "props": [
//     {
//       "name": "propName",
//       "type": "string | number | boolean",
//       "required": true,
//       "description": "What this prop does",
//       "example": "'example value'",
//       "validation": "What values are accepted"
//     }
//   ],
//   ${
//     includeTests
//       ? `"tests": {
//     "filename": "Component.test.tsx",
//     "code": "// Complete test code with explanations",
//     "framework": "Jest | Vitest | React Testing Library",
//     "explanation": "What each test checks and why it matters",
//     "testCases": [
//       {
//         "test": "renders correctly",
//         "why": "Ensures component displays without errors",
//         "whatItChecks": "Specific elements that should appear"
//       }
//     ]
//   },`
//       : ""
//   }
//   "howItWorks": {
//     "flow": [
//       "1. User does X",
//       "2. Code responds by doing Y",
//       "3. Result is Z"
//     ],
//     "dataFlow": "Explain how data moves through the component",
//     "renderCycle": "When and why component re-renders"
//   },
//   "bestPractices": [
//     {
//       "practice": "Specific best practice",
//       "why": "Why this matters in production",
//       "example": "// Code showing right way",
//       "wrongWay": "// What NOT to do",
//       "impact": "What happens if you don't follow this"
//     }
//   ],
//   "accessibility": [
//     {
//       "practice": "Accessibility consideration",
//       "implementation": "How it's implemented in this code",
//       "why": "Why this matters for users",
//       "testing": "How to test this works"
//     }
//   ],
//   "performance": [
//     {
//       "optimization": "Performance tip",
//       "implementation": "Where it's used in code",
//       "impact": "How much this helps",
//       "tradeoffs": "Any downsides to consider"
//     }
//   ],
//   "commonMistakes": [
//     {
//       "mistake": "What beginners often do wrong",
//       "why": "Why this is a mistake",
//       "correct": "// Right way to do it",
//       "howToAvoid": "Tips to prevent this mistake"
//     }
//   ],
//   "troubleshooting": [
//     {
//       "issue": "Common problem that might occur",
//       "symptoms": "How to recognize this issue",
//       "cause": "Why this happens",
//       "solution": "Step-by-step fix",
//       "prevention": "How to avoid it next time"
//     }
//   ],
//   "realWorldAnalogies": [
//     {
//       "codeConcept": "Technical concept in code",
//       "analogy": "Real-world comparison",
//       "explanation": "How the analogy maps to code"
//     }
//   ],
//   "extendingThisCode": [
//     {
//       "enhancement": "Feature to add next",
//       "difficulty": "Easy/Medium/Hard",
//       "steps": "How to implement it",
//       "learningValue": "What you'll learn by doing this"
//     }
//   ],
//   "alternatives": [
//     {
//       "approach": "Alternative way to implement this",
//       "when": "When to use this alternative",
//       "tradeoffs": "Pros and cons comparison",
//       "example": "// Brief code example"
//     }
//   ],
//   "deepDive": {
//     "advancedConcepts": [
//       {
//         "concept": "Advanced concept used",
//         "explanation": "Deep technical explanation",
//         "resources": "Where to learn more"
//       }
//     ],
//     "underTheHood": "What's happening behind the scenes",
//     "browserBehavior": "How browser processes this code"
//   },
//   "learningPath": {
//     "prerequisites": "What you should know before using this code",
//     "nextSteps": "What to learn after mastering this",
//     "relatedConcepts": "Connected topics to explore"
//   }
// }

// CRITICAL RULES:
// 1. Every code block needs inline comments explaining WHAT and WHY
// 2. Provide line-by-line breakdown for key sections
// 3. Use real-world analogies for every complex concept
// 4. Show wrong vs. right examples in common mistakes
// 5. Explain technical terms in simple language
// 6. Make it educational - teach, don't just provide code
// 7. Include realistic, working examples only
// 8. All JSON must be valid - no extra text
// 9. Think: "Would a beginner understand this after reading?"

// Remember: You're not just generating code, you're teaching someone to be a better developer!`;

//   const response = await openRouterClient.generateCompletion(
//     systemPrompt,
//     config.openrouter.models.advanced
//   );

//   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
//   const jsonString = jsonMatch ? jsonMatch[1] : response;

//   try {
//     const parsed = JSON.parse(jsonString);

//     if (!parsed.mainCode || !parsed.mainCode.code) {
//       throw new Error("Invalid code structure in AI response");
//     }

//     return {
//       ...parsed,
//       metadata: {
//         generatedAt: new Date().toISOString(),
//         language,
//         framework,
//         includeTests,
//         includeComments,
//       },
//       rawResponse: response,
//     };
//   } catch (error) {
//     console.error("Failed to parse AI response:", error);

//     const codeMatch = response.match(/```(?:\w+)?\s*([\s\S]*?)\s*```/);
//     const extractedCode = codeMatch ? codeMatch[1] : response;

//     return {
//       title: "Generated Code",
//       description: prompt,
//       mainCode: {
//         filename: `Component.${language === "typescript" ? "tsx" : "jsx"}`,
//         language,
//         code: extractedCode,
//         explanation: "Generated code based on your request",
//       },
//       additionalFiles: [],
//       dependencies: [],
//       usage: { description: "Use this code in your project", example: "" },
//       features: ["Generated functionality"],
//       metadata: {
//         generatedAt: new Date().toISOString(),
//         language,
//         framework,
//         includeTests,
//         includeComments,
//         fallback: true,
//       },
//       rawResponse: response,
//     };
//   }
// }

// function generateCodeFallback(
//   prompt: string,
//   language: string,
//   framework: string
// ): any {
//   const extension = language === "typescript" ? "tsx" : "jsx";
//   const isReact = framework.toLowerCase().includes("react");

//   const codeTemplate = isReact
//     ? `import React from 'react';

// // Component for: ${prompt}
// // This is a basic template - customize it for your needs

// interface ${prompt.split(" ")[0] || "Component"}Props {
//   // Define your props here
//   // Props are like parameters for your component
//   // Example: title: string; onClick: () => void;
// }

// /**
//  * ${prompt.split(" ")[0] || "Component"} Component
//  *
//  * Purpose: Implement ${prompt}
//  *
//  * How it works:
//  * 1. Receives props from parent component
//  * 2. Manages its own state (if needed)
//  * 3. Renders UI elements
//  * 4. Handles user interactions
//  */
// const ${prompt.split(" ")[0] || "Component"}: React.FC<${
//         prompt.split(" ")[0] || "Component"
//       }Props> = (props) => {
//   // State management (if needed)
//   // const [state, setState] = React.useState(initialValue);

//   // Event handlers
//   // const handleClick = () => { ... };

//   return (
//     <div className="container">
//       <h1>Your Component</h1>
//       {/* ${prompt} */}
//       <p>Implement your component logic here</p>

//       {/*
//         Next steps:
//         1. Add your state variables
//         2. Create event handlers
//         3. Build your UI structure
//         4. Add styling
//       */}
//     </div>
//   );
// };

// export default ${prompt.split(" ")[0] || "Component"};`
//     : `// ${prompt}

// /**
//  * Main function
//  * Purpose: Implement ${prompt}
//  *
//  * How to use:
//  * 1. Import this function
//  * 2. Call it with required parameters
//  * 3. Process the result
//  */
// function main() {
//   console.log('Your code implementation here');

//   // Step 1: Initialize variables

//   // Step 2: Add your logic

//   // Step 3: Return result
// }

// export default main;`;

//   return {
//     title: `${framework} ${language} Code`,
//     description: prompt,
//     overview: {
//       purpose: `Generate code for: ${prompt}`,
//       approach: "Basic template structure",
//       complexity: "Simple",
//       learningValue: "Foundation for custom implementation",
//     },
//     mainCode: {
//       filename: `Component.${extension}`,
//       language,
//       code: codeTemplate,
//       explanation: `This is a basic ${framework} template. Customize it based on your specific needs.`,
//       lineByLineExplanation: [
//         {
//           lines: "1-3",
//           code: "import React from 'react';",
//           what: "Importing React library",
//           why: "Needed to create React components",
//           analogy: "Like getting your tools before starting work",
//         },
//       ],
//       keyConceptsUsed: [
//         {
//           concept: "React Components",
//           explanation: "Reusable pieces of UI",
//           analogy: "Like LEGO blocks - build once, use many times",
//           moreInfo: "Components can be combined to create complex UIs",
//         },
//       ],
//     },
//     codeBreakdown: {
//       sections: [
//         {
//           title: "Imports Section",
//           purpose: "Bringing in necessary libraries",
//           explanation: "We import React to enable component creation",
//           analogy: "Like opening your toolbox before fixing something",
//         },
//         {
//           title: "Component Structure",
//           purpose: "Defining the component",
//           explanation: "This creates a reusable piece of UI",
//           analogy: "Like creating a recipe you can follow repeatedly",
//         },
//       ],
//     },
//     additionalFiles: [],
//     styling: isReact
//       ? {
//           filename: "Component.module.css",
//           code: `.container {\n  /* Main wrapper */\n  padding: 1rem;\n  /* 1rem = 16px, gives breathing room */\n}\n\n.title {\n  /* Heading style */\n  font-size: 1.5rem;\n  font-weight: bold;\n  /* Makes text stand out */\n}`,
//           approach: "CSS Modules",
//           explanation: "CSS Modules scope styles to this component only",
//           keyConcepts: [
//             {
//               concept: "Scoped Styling",
//               why: "Prevents style conflicts between components",
//               analogy: "Like each room in a house having its own paint color",
//             },
//           ],
//         }
//       : null,
//     dependencies: isReact
//       ? [
//           {
//             name: "react",
//             version: "^18.2.0",
//             purpose: "Core React library for building UI",
//             whatItDoes: "Provides the tools to create interactive components",
//             alternatives: "Vue, Angular, Svelte",
//           },
//         ]
//       : [],
//     installation: {
//       commands: isReact ? ["npm install react react-dom"] : [],
//       notes: "Install required dependencies before using",
//       explanation:
//         "npm install downloads packages from the internet to your project",
//     },
//     usage: {
//       description: "Import and use this component in your application",
//       example: `import Component from './Component';\n\nfunction App() {\n  return <Component />;\n}`,
//       explanation: "Import the component, then use it like an HTML tag",
//       commonScenarios: [
//         {
//           scenario: "Using in a page",
//           implementation: "Import and place in your JSX like shown above",
//         },
//       ],
//     },
//     features: [
//       {
//         feature: "Basic structure",
//         description: "Provides foundation for customization",
//         codeLocation: "Main component body",
//         howItWorks: "Renders a simple div with placeholder content",
//       },
//     ],
//     props: [],
//     howItWorks: {
//       flow: [
//         "1. Component receives props (if any)",
//         "2. Component renders its JSX",
//         "3. User sees the output on screen",
//       ],
//       dataFlow: "Props flow from parent to child components",
//       renderCycle: "Component re-renders when props or state change",
//     },
//     bestPractices: [
//       {
//         practice: "Add proper TypeScript types",
//         why: "Catches errors before runtime",
//         example: "// interface Props { name: string; }",
//         wrongWay: "// Using 'any' type everywhere",
//         impact: "Better code quality and fewer bugs",
//       },
//       {
//         practice: "Include error handling",
//         why: "Prevents app crashes",
//         example: "// try-catch blocks for risky operations",
//         wrongWay: "// Assuming everything works perfectly",
//         impact: "More robust, production-ready code",
//       },
//     ],
//     accessibility: [
//       {
//         practice: "Add ARIA labels",
//         implementation: "Use aria-label on interactive elements",
//         why: "Helps screen readers understand your UI",
//         testing: "Use screen reader tools to test",
//       },
//     ],
//     performance: [
//       {
//         optimization: "Use React.memo for optimization",
//         implementation: "Wrap component: export default React.memo(Component)",
//         impact: "Prevents unnecessary re-renders",
//         tradeoffs: "Slight memory overhead",
//       },
//     ],
//     commonMistakes: [
//       {
//         mistake: "Forgetting to export component",
//         why: "Other files won't be able to import it",
//         correct: "// export default Component;",
//         howToAvoid: "Always check your exports",
//       },
//     ],
//     troubleshooting: [
//       {
//         issue: "Component doesn't render",
//         symptoms: "Blank screen or error in console",
//         cause: "Import/export mismatch or syntax error",
//         solution: "Check imports, exports, and look for typos",
//         prevention: "Use TypeScript for better error detection",
//       },
//     ],
//     realWorldAnalogies: [
//       {
//         codeConcept: "React Component",
//         analogy: "Like a reusable stamp",
//         explanation:
//           "Create the design once, stamp it multiple times wherever needed",
//       },
//     ],
//     extendingThisCode: [
//       {
//         enhancement: "Add state management",
//         difficulty: "Easy",
//         steps: "Use useState hook to track data",
//         learningValue: "Learn how to make interactive components",
//       },
//     ],
//     alternatives: [],
//     deepDive: {
//       advancedConcepts: [
//         {
//           concept: "Component lifecycle",
//           explanation: "How components mount, update, and unmount",
//           resources: "React official documentation",
//         },
//       ],
//       underTheHood:
//         "React creates a virtual DOM and efficiently updates real DOM",
//       browserBehavior: "Browser parses JSX (converted to JS) and renders HTML",
//     },
//     learningPath: {
//       prerequisites: "Basic JavaScript and HTML knowledge",
//       nextSteps: "Learn about state management with useState and useEffect",
//       relatedConcepts: "Props, state, hooks, component composition",
//     },
//     metadata: {
//       generatedAt: new Date().toISOString(),
//       language,
//       framework,
//       includeTests: false,
//       includeComments: true,
//       fallback: true,
//     },
//   };
// }

// export async function GET() {
//   return NextResponse.json(
//     { success: false, error: "Method not allowed" },
//     { status: 405 }
//   );
// }

// app/api/code/route.ts
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
    console.log("Code generation API called");

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimiter.isAllowed(`code:${clientIp}`, config.rateLimit.guidance)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      prompt,
      language = "typescript",
      framework = "react",
      includeTests = false,
      includeComments = true,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Code prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt too short. Please describe what code you need.",
        },
        { status: 400 }
      );
    }

    console.log("Generating code for:", prompt);

    let codeResult;

    if (config.openrouter.apiKey) {
      try {
        codeResult = await generateCodeWithAI(
          prompt,
          language,
          framework,
          includeTests,
          includeComments
        );
        console.log("AI code generation successful");
      } catch (error) {
        console.warn("OpenRouter API failed, using fallback:", error);
        codeResult = await generateDynamicFallback(prompt, language, framework);
      }
    } else {
      console.log("Using fallback (no API key)");
      codeResult = await generateDynamicFallback(prompt, language, framework);
    }

    return NextResponse.json({
      success: true,
      data: codeResult,
    });
  } catch (error) {
    console.error("Code generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate code",
      },
      { status: 500 }
    );
  }
}

async function generateCodeWithAI(
  prompt: string,
  language: string,
  framework: string,
  includeTests: boolean,
  includeComments: boolean
): Promise<any> {
  const systemPrompt = `You are an expert software developer. Analyze the user's request and generate ACTUAL, WORKING CODE that solves their specific problem.

USER REQUEST: "${prompt}"
LANGUAGE: ${language}
FRAMEWORK: ${framework}

Generate REAL, COMPLETE code that the user can immediately use. Then provide educational context.

Return ONLY valid JSON with this structure:

{
  "title": "Descriptive title of what you generated",
  "description": "Brief description of the solution",
  "overview": {
    "purpose": "What problem this code solves",
    "complexity": "Simple/Medium/Complex"
  },
  "mainCode": {
    "filename": "appropriate-filename.${getFileExtension(language, framework)}",
    "language": "${language}",
    "code": "ACTUAL COMPLETE CODE THAT SOLVES THE USER'S PROBLEM - make sure this is real working code that matches their request exactly",
    "explanation": "Brief explanation of how this code works"
  },
  "features": [
    {
      "feature": "Feature name",
      "description": "What this feature does",
      "howItWorks": "How it's implemented"
    }
  ],
  "usage": {
    "description": "How to use this code",
    "example": "Practical usage example"
  },
  "dependencies": [
    {
      "name": "actual-package-name",
      "version": "appropriate-version",
      "purpose": "Why this is needed"
    }
  ],
  "bestPractices": [
    {
      "practice": "Relevant best practice",
      "why": "Why this matters for this specific code",
      "example": "Code example showing the practice"
    }
  ]
}

IMPORTANT: The "code" field must contain ACTUAL WORKING CODE that directly addresses: "${prompt}"`;

  const response = await openRouterClient.generateCompletion(
    systemPrompt,
    config.openrouter.models.advanced
  );

  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : response;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(
      "Failed to parse AI response, using dynamic fallback:",
      error
    );
    return await generateDynamicFallback(prompt, language, framework);
  }
}

function getFileExtension(language: string, framework: string): string {
  if (language === "typescript") {
    if (framework.includes("react")) return "tsx";
    return "ts";
  } else {
    if (framework.includes("react")) return "jsx";
    return "js";
  }
}

async function generateDynamicFallback(
  prompt: string,
  language: string,
  framework: string
): Promise<any> {
  // For fallback, we'll still generate context-aware code
  const extension = getFileExtension(language, framework);
  const isReact = framework.toLowerCase().includes("react");

  // Extract component name from prompt or use generic
  const componentName = extractComponentName(prompt) || "Component";

  const code = generateContextAwareCode(
    prompt,
    language,
    framework,
    componentName
  );

  return {
    title: `${componentName} - ${framework}`,
    description: `Generated code for: ${prompt}`,
    overview: {
      purpose: `Implement ${prompt}`,
      complexity: "Medium",
    },
    mainCode: {
      filename: `${componentName}.${extension}`,
      language,
      code: code,
      explanation: `This ${framework} component addresses your request for: ${prompt}`,
    },
    features: [
      {
        feature: "Core functionality",
        description: `Implements the main requirement: ${prompt.substring(
          0,
          50
        )}...`,
        howItWorks: "Provides the basic structure you requested",
      },
    ],
    usage: {
      description: `Use this ${componentName} in your ${framework} application`,
      example: `import ${componentName} from './${componentName}';`,
    },
    dependencies: isReact
      ? [
          {
            name: "react",
            version: "^18.2.0",
            purpose: "Required for React components",
          },
        ]
      : [],
    bestPractices: [
      {
        practice: "Add proper error handling",
        why: "Makes your code more robust",
        example: "// Add try-catch blocks for async operations",
      },
    ],
  };
}

function extractComponentName(prompt: string): string {
  // Simple extraction logic - in real scenario, AI would handle this
  if (prompt.toLowerCase().includes("footer")) return "Footer";
  if (prompt.toLowerCase().includes("header")) return "Header";
  if (prompt.toLowerCase().includes("button")) return "Button";
  if (prompt.toLowerCase().includes("navbar")) return "Navbar";
  if (prompt.toLowerCase().includes("card")) return "Card";
  return "CustomComponent";
}

function generateContextAwareCode(
  prompt: string,
  language: string,
  framework: string,
  componentName: string
): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("footer") && lowerPrompt.includes("menu")) {
    return `import React from 'react';
import Link from 'next/link';

interface FooterProps {
  companyName?: string;
  year?: number;
}

const ${componentName}: React.FC<FooterProps> = ({ 
  companyName = "Your Company", 
  year = new Date().getFullYear() 
}) => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Navigation Links */}
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-wrap gap-4">
              <Link href="/" className="hover:text-blue-300 transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-blue-300 transition-colors">
                About
              </Link>
              <Link href="/menu" className="hover:text-blue-300 transition-colors">
                Menu
              </Link>
              <Link href="/contact" className="hover:text-blue-300 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
          
          {/* Company Info */}
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <p>Email: info@company.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; {year} {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default ${componentName};`;
  }

  // Basic template for other requests
  return `import React from 'react';

interface ${componentName}Props {
  // Add your props here based on: ${prompt}
}

const ${componentName}: React.FC<${componentName}Props> = (props) => {
  // Implement functionality for: ${prompt}
  
  return (
    <div className="${componentName.toLowerCase()}">
      <h2>${componentName} Component</h2>
      <p>This component was generated for: ${prompt}</p>
      {/* Add your JSX/TSX content here */}
    </div>
  );
};

export default ${componentName};`;
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
