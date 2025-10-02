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

//     console.log("Generating code for:", prompt);

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
//         codeResult = await generateDynamicFallback(prompt, language, framework);
//       }
//     } else {
//       console.log("Using fallback (no API key)");
//       codeResult = await generateDynamicFallback(prompt, language, framework);
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
//   const systemPrompt = `You are an expert software developer. Analyze the user's request and generate ACTUAL, WORKING CODE that solves their specific problem.

// USER REQUEST: "${prompt}"
// LANGUAGE: ${language}
// FRAMEWORK: ${framework}

// Generate REAL, COMPLETE code that the user can immediately use. Then provide educational context.

// Return ONLY valid JSON with this structure:

// {
//   "title": "Descriptive title of what you generated",
//   "description": "Brief description of the solution",
//   "overview": {
//     "purpose": "What problem this code solves",
//     "complexity": "Simple/Medium/Complex"
//   },
//   "mainCode": {
//     "filename": "appropriate-filename.${getFileExtension(language, framework)}",
//     "language": "${language}",
//     "code": "ACTUAL COMPLETE CODE THAT SOLVES THE USER'S PROBLEM - make sure this is real working code that matches their request exactly",
//     "explanation": "Brief explanation of how this code works"
//   },
//   "features": [
//     {
//       "feature": "Feature name",
//       "description": "What this feature does",
//       "howItWorks": "How it's implemented"
//     }
//   ],
//   "usage": {
//     "description": "How to use this code",
//     "example": "Practical usage example"
//   },
//   "dependencies": [
//     {
//       "name": "actual-package-name",
//       "version": "appropriate-version",
//       "purpose": "Why this is needed"
//     }
//   ],
//   "bestPractices": [
//     {
//       "practice": "Relevant best practice",
//       "why": "Why this matters for this specific code",
//       "example": "Code example showing the practice"
//     }
//   ]
// }

// IMPORTANT: The "code" field must contain ACTUAL WORKING CODE that directly addresses: "${prompt}"`;

//   const response = await openRouterClient.generateCompletion(
//     systemPrompt,
//     config.openrouter.models.advanced
//   );

//   const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
//   const jsonString = jsonMatch ? jsonMatch[1] : response;

//   try {
//     return JSON.parse(jsonString);
//   } catch (error) {
//     console.error(
//       "Failed to parse AI response, using dynamic fallback:",
//       error
//     );
//     return await generateDynamicFallback(prompt, language, framework);
//   }
// }

// function getFileExtension(language: string, framework: string): string {
//   if (language === "typescript") {
//     if (framework.includes("react")) return "tsx";
//     return "ts";
//   } else {
//     if (framework.includes("react")) return "jsx";
//     return "js";
//   }
// }

// async function generateDynamicFallback(
//   prompt: string,
//   language: string,
//   framework: string
// ): Promise<any> {
//   // For fallback, we'll still generate context-aware code
//   const extension = getFileExtension(language, framework);
//   const isReact = framework.toLowerCase().includes("react");

//   // Extract component name from prompt or use generic
//   const componentName = extractComponentName(prompt) || "Component";

//   const code = generateContextAwareCode(
//     prompt,
//     language,
//     framework,
//     componentName
//   );

//   return {
//     title: `${componentName} - ${framework}`,
//     description: `Generated code for: ${prompt}`,
//     overview: {
//       purpose: `Implement ${prompt}`,
//       complexity: "Medium",
//     },
//     mainCode: {
//       filename: `${componentName}.${extension}`,
//       language,
//       code: code,
//       explanation: `This ${framework} component addresses your request for: ${prompt}`,
//     },
//     features: [
//       {
//         feature: "Core functionality",
//         description: `Implements the main requirement: ${prompt.substring(
//           0,
//           50
//         )}...`,
//         howItWorks: "Provides the basic structure you requested",
//       },
//     ],
//     usage: {
//       description: `Use this ${componentName} in your ${framework} application`,
//       example: `import ${componentName} from './${componentName}';`,
//     },
//     dependencies: isReact
//       ? [
//           {
//             name: "react",
//             version: "^18.2.0",
//             purpose: "Required for React components",
//           },
//         ]
//       : [],
//     bestPractices: [
//       {
//         practice: "Add proper error handling",
//         why: "Makes your code more robust",
//         example: "// Add try-catch blocks for async operations",
//       },
//     ],
//   };
// }

// function extractComponentName(prompt: string): string {
//   // Simple extraction logic - in real scenario, AI would handle this
//   if (prompt.toLowerCase().includes("footer")) return "Footer";
//   if (prompt.toLowerCase().includes("header")) return "Header";
//   if (prompt.toLowerCase().includes("button")) return "Button";
//   if (prompt.toLowerCase().includes("navbar")) return "Navbar";
//   if (prompt.toLowerCase().includes("card")) return "Card";
//   return "CustomComponent";
// }

// function generateContextAwareCode(
//   prompt: string,
//   language: string,
//   framework: string,
//   componentName: string
// ): string {
//   const lowerPrompt = prompt.toLowerCase();

//   if (lowerPrompt.includes("footer") && lowerPrompt.includes("menu")) {
//     return `import React from 'react';
// import Link from 'next/link';

// interface FooterProps {
//   companyName?: string;
//   year?: number;
// }

// const ${componentName}: React.FC<FooterProps> = ({
//   companyName = "Your Company",
//   year = new Date().getFullYear()
// }) => {
//   return (
//     <footer className="bg-gray-800 text-white py-8">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-wrap justify-between">
//           {/* Navigation Links */}
//           <div className="w-full md:w-auto mb-4 md:mb-0">
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <nav className="flex flex-wrap gap-4">
//               <Link href="/" className="hover:text-blue-300 transition-colors">
//                 Home
//               </Link>
//               <Link href="/about" className="hover:text-blue-300 transition-colors">
//                 About
//               </Link>
//               <Link href="/menu" className="hover:text-blue-300 transition-colors">
//                 Menu
//               </Link>
//               <Link href="/contact" className="hover:text-blue-300 transition-colors">
//                 Contact
//               </Link>
//             </nav>
//           </div>

//           {/* Company Info */}
//           <div className="w-full md:w-auto">
//             <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
//             <p>Email: info@company.com</p>
//             <p>Phone: (555) 123-4567</p>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="border-t border-gray-700 mt-8 pt-4 text-center">
//           <p>&copy; {year} {companyName}. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default ${componentName};`;
//   }

//   // Basic template for other requests
//   return `import React from 'react';

// interface ${componentName}Props {
//   // Add your props here based on: ${prompt}
// }

// const ${componentName}: React.FC<${componentName}Props> = (props) => {
//   // Implement functionality for: ${prompt}

//   return (
//     <div className="${componentName.toLowerCase()}">
//       <h2>${componentName} Component</h2>
//       <p>This component was generated for: ${prompt}</p>
//       {/* Add your JSX/TSX content here */}
//     </div>
//   );
// };

// export default ${componentName};`;
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
  const lang = language.toLowerCase();
  const fw = framework.toLowerCase();

  // React variants
  if (fw.includes("react")) {
    if (lang === "typescript") return "tsx";
    return "jsx";
  }

  // Language-specific extensions
  switch (lang) {
    case "typescript":
      return "ts";
    case "javascript":
      return "js";
    case "python":
      return "py";
    case "java":
      return "java";
    case "cpp":
    case "c++":
      return "cpp";
    case "c":
      return "c";
    case "csharp":
    case "c#":
      return "cs";
    case "go":
      return "go";
    case "rust":
      return "rs";
    case "php":
      return "php";
    case "ruby":
      return "rb";
    case "swift":
      return "swift";
    case "kotlin":
      return "kt";
    case "html":
      return "html";
    case "css":
      return "css";
    case "sql":
      return "sql";
    case "shell":
    case "bash":
      return "sh";
    case "powershell":
      return "ps1";
    default:
      return "txt";
  }
}

async function generateDynamicFallback(
  prompt: string,
  language: string,
  framework: string
): Promise<any> {
  const extension = getFileExtension(language, framework);
  const isReact = framework.toLowerCase().includes("react");

  // Extract component/function name from prompt or use generic
  const componentName = extractComponentName(prompt) || "Component";

  const code = generateContextAwareCode(
    prompt,
    language,
    framework,
    componentName
  );

  return {
    title: `${componentName} - ${framework || language}`,
    description: `Generated code for: ${prompt}`,
    overview: {
      purpose: `Implement ${prompt}`,
      complexity: "Medium",
    },
    mainCode: {
      filename: `${componentName}.${extension}`,
      language,
      code: code,
      explanation: `This ${
        framework || language
      } code addresses your request for: ${prompt}`,
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
      description: `Use this ${componentName} in your ${
        framework || language
      } application`,
      example: isReact
        ? `import ${componentName} from './${componentName}';`
        : `// See code comments for usage instructions`,
    },
    dependencies: getDependencies(language, framework),
    bestPractices: [
      {
        practice: "Add proper error handling",
        why: "Makes your code more robust",
        example: "// Add try-catch blocks for async operations",
      },
    ],
  };
}

function getDependencies(language: string, framework: string): any[] {
  const fw = framework.toLowerCase();

  if (fw.includes("react")) {
    return [
      {
        name: "react",
        version: "^18.2.0",
        purpose: "Required for React components",
      },
    ];
  }

  if (fw.includes("vue")) {
    return [
      {
        name: "vue",
        version: "^3.3.0",
        purpose: "Required for Vue components",
      },
    ];
  }

  if (fw.includes("angular")) {
    return [
      {
        name: "@angular/core",
        version: "^17.0.0",
        purpose: "Required for Angular components",
      },
    ];
  }

  return [];
}

function extractComponentName(prompt: string): string {
  const lower = prompt.toLowerCase();

  // Common component names
  if (lower.includes("footer")) return "Footer";
  if (lower.includes("header")) return "Header";
  if (lower.includes("button")) return "Button";
  if (lower.includes("navbar")) return "Navbar";
  if (lower.includes("card")) return "Card";
  if (lower.includes("form")) return "Form";
  if (lower.includes("modal")) return "Modal";
  if (lower.includes("table")) return "Table";
  if (lower.includes("list")) return "List";

  // Generic names based on action
  if (lower.includes("calculate")) return "Calculator";
  if (lower.includes("search")) return "SearchHandler";
  if (lower.includes("fetch") || lower.includes("api")) return "ApiHandler";

  return "CustomComponent";
}

function generateContextAwareCode(
  prompt: string,
  language: string,
  framework: string,
  componentName: string
): string {
  const lowerPrompt = prompt.toLowerCase();
  const lang = language.toLowerCase();
  const fw = framework.toLowerCase();

  // React Components
  if (fw.includes("react")) {
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

    // Generic React component
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

  // HTML
  if (lang === "html") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${componentName}</h1>
        <p>This HTML was generated for: ${prompt}</p>
        <!-- Add your HTML content here -->
    </div>
    
    <script>
        // Add your JavaScript here
        console.log('${componentName} loaded');
    </script>
</body>
</html>`;
  }

  // Python
  if (lang === "python") {
    return `"""
${componentName}
Generated for: ${prompt}
"""

def main():
    """
    Main function for: ${prompt}
    """
    # Implement your logic here
    print("${componentName} - Generated for: ${prompt}")
    
    # Add your code here
    pass

if __name__ == "__main__":
    main()`;
  }

  // JavaScript
  if (lang === "javascript") {
    return `/**
 * ${componentName}
 * Generated for: ${prompt}
 */

function ${componentName}() {
    // Implement functionality for: ${prompt}
    console.log('${componentName} initialized');
    
    // Add your code here
}

// Export for use in other modules
export default ${componentName};`;
  }

  // Java
  if (lang === "java") {
    return `/**
 * ${componentName}
 * Generated for: ${prompt}
 */
public class ${componentName} {
    
    public static void main(String[] args) {
        System.out.println("${componentName} - Generated for: ${prompt}");
        // Add your code here
    }
    
    // Add your methods here
}`;
  }

  // C++
  if (lang === "cpp" || lang === "c++") {
    return `#include <iostream>
using namespace std;

/**
 * ${componentName}
 * Generated for: ${prompt}
 */

int main() {
    cout << "${componentName} - Generated for: ${prompt}" << endl;
    
    // Add your code here
    
    return 0;
}`;
  }

  // Generic fallback
  return `// ${componentName}
// Generated for: ${prompt}
// Language: ${language}
// Framework: ${framework}

// Add your ${language} code here to implement: ${prompt}`;
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
