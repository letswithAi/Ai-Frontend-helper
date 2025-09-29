// // LLM Prompt templates for the AI-powered Frontend Helper

// export interface PromptContext {
//   description: string;
//   framework?: "react" | "next" | "vue" | "angular";
//   complexity?: "simple" | "medium" | "complex";
//   includeAccessibility?: boolean;
//   includeTests?: boolean;
//   userPreferences?: {
//     styleLibrary?: "mui" | "tailwind" | "styled-components" | "css";
//     typescript?: boolean;
//     responsive?: boolean;
//   };
// }

// export interface ComponentInfo {
//   name: string;
//   count: number;
//   description: string;
//   complexity: 1 | 2 | 3 | 4 | 5;
//   dependencies?: string[];
//   props?: string[];
// }

// export interface GuidanceResponse {
//   pageType: string;
//   folderStructure: Record<string, string[]>;
//   components: ComponentInfo[];
//   codeSnippets: Array<{
//     title: string;
//     code: string;
//     language: string;
//     description: string;
//   }>;
//   complexity: 1 | 2 | 3 | 4 | 5;
//   estimatedTime: string;
//   accessibility: string[];
//   recommendations: string[];
//   dependencies: string[];
// }

// /**
//  * Main prompt for generating development guidance from UI descriptions
//  */
// export const GUIDANCE_PROMPT = `You are an expert frontend developer and UI architect. Analyze the provided UI description and generate comprehensive development guidance.

// **Context:**
// - Framework: {framework}
// - Complexity Level: {complexity}
// - Include Accessibility: {includeAccessibility}
// - User Preferences: {userPreferences}

// **UI Description:**
// {description}

// **Instructions:**
// 1. Identify the page/component type (Login, Dashboard, Landing, Form, etc.)
// 2. Break down into logical components with complexity ratings (1-5 scale)
// 3. Suggest folder structure following best practices
// 4. Provide small, focused code snippets (3-10 lines each)
// 5. Estimate development time and complexity
// 6. Include accessibility considerations
// 7. Recommend best practices and potential pitfalls

// **Required JSON Response Format:**
// \`\`\`json
// {
//   "pageType": "string",
//   "folderStructure": {
//     "components/": ["List of component files"],
//     "hooks/": ["Custom hooks if needed"],
//     "utils/": ["Utility functions"],
//     "types/": ["TypeScript definitions"],
//     "styles/": ["Style files"]
//   },
//   "components": [
//     {
//       "name": "ComponentName",
//       "count": 1,
//       "description": "Brief description",
//       "complexity": 3,
//       "dependencies": ["@mui/material", "react-hook-form"],
//       "props": ["title", "onSubmit", "disabled"]
//     }
//   ],
//   "codeSnippets": [
//     {
//       "title": "Component Structure",
//       "code": "const Component = () => { return <div>...</div>; }",
//       "language": "typescript",
//       "description": "Basic component setup"
//     }
//   ],
//   "complexity": 3,
//   "estimatedTime": "2-4 hours",
//   "accessibility": [
//     "Add ARIA labels for form inputs",
//     "Ensure keyboard navigation support"
//   ],
//   "recommendations": [
//     "Use form validation library",
//     "Implement error boundaries"
//   ],
//   "dependencies": [
//     "@mui/material",
//     "react-hook-form",
//     "@hookform/resolvers"
//   ]
// }
// \`\`\`

// **Important Guidelines:**
// - Keep code snippets short and focused (max 10 lines)
// - Rate complexity realistically (1=very simple, 5=very complex)
// - Include only necessary dependencies
// - Consider responsive design patterns
// - Suggest modern React patterns (hooks, functional components)
// - Include TypeScript types when applicable`;

// /**
//  * Prompt for generating complete code files
//  */
// export const CODE_GENERATION_PROMPT = `You are a senior frontend developer. Generate production-ready code based on the provided guidance.

// **Development Guidance:**
// {guidance}

// **Requirements:**
// - Target Framework: {targetFramework}
// - Include Tests: {includeTests}
// - Include Styles: {includeStyles}
// - TypeScript: {useTypeScript}

// **Instructions:**
// 1. Generate complete, functional components
// 2. Include proper imports and exports
// 3. Add comprehensive TypeScript types
// 4. Implement responsive design patterns
// 5. Follow framework best practices
// 6. Include error handling and loading states
// 7. Add meaningful comments for complex logic
// 8. Generate corresponding test files if requested

// **Code Quality Standards:**
// - Use modern React patterns (hooks, functional components)
// - Implement proper prop validation
// - Add accessibility attributes (ARIA labels, roles)
// - Include error boundaries where appropriate
// - Use semantic HTML elements
// - Implement keyboard navigation support
// - Add loading and error states
// - Follow consistent naming conventions

// **Response Format:**
// Generate an array of file objects with proper TypeScript/JSX code:

// \`\`\`json
// {
//   "files": [
//     {
//       "path": "components/LoginForm.tsx",
//       "content": "// Complete component code here",
//       "type": "component",
//       "description": "Main login form component"
//     },
//     {
//       "path": "components/LoginForm.test.tsx",
//       "content": "// Jest test file",
//       "type": "test",
//       "description": "Unit tests for LoginForm"
//     }
//   ],
//   "dependencies": {
//     "dependencies": ["@mui/material", "react-hook-form"],
//     "devDependencies": ["@testing-library/react", "@types/jest"]
//   }
// }
// \`\`\``;

// /**
//  * Prompt for framework conversion
//  */
// export const FRAMEWORK_CONVERSION_PROMPT = `You are a frontend architecture expert. Convert the provided code from {sourceFramework} to {targetFramework}.

// **Source Code:**
// {sourceCode}

// **Conversion Requirements:**
// - Maintain exact functionality
// - Follow {targetFramework} best practices
// - Update imports and syntax appropriately
// - Preserve component logic and state management
// - Convert styling approach if needed
// - Update routing patterns if applicable

// **Framework-Specific Considerations:**

// **React to Next.js:**
// - Add 'use client' directive for client components
// - Use Next.js routing conventions
// - Implement proper page components
// - Add SEO metadata where appropriate

// **React to Vue:**
// - Convert JSX to Vue template syntax
// - Use Vue Composition API
// - Convert props and events appropriately
// - Update lifecycle methods

// **Next.js to React:**
// - Remove Next.js specific imports
// - Convert pages to regular components
// - Update routing to React Router
// - Remove server-side specific code

// Provide the converted code maintaining the same structure and functionality.`;

// /**
//  * Prompt for accessibility audit
//  */
// export const ACCESSIBILITY_AUDIT_PROMPT = `You are a web accessibility expert (WCAG 2.1 AA certified). Audit the provided UI description for accessibility issues and recommendations.

// **UI Description:**
// {description}

// **Audit Areas:**
// 1. **Keyboard Navigation** - Can all interactive elements be accessed via keyboard?
// 2. **Screen Reader Support** - Are proper ARIA labels and roles present?
// 3. **Color Contrast** - Is text readable against backgrounds?
// 4. **Focus Management** - Is focus handled properly for dynamic content?
// 5. **Semantic HTML** - Are proper HTML elements used?
// 6. **Form Accessibility** - Are form fields properly labeled?
// 7. **Error Handling** - Are errors announced to assistive technology?

// **Response Format:**
// \`\`\`json
// {
//   "score": 85,
//   "issues": [
//     {
//       "severity": "high|medium|low",
//       "category": "keyboard|screen-reader|contrast|focus|semantic|forms|errors",
//       "description": "Issue description",
//       "recommendation": "How to fix",
//       "wcagReference": "WCAG 2.1 AA guideline reference"
//     }
//   ],
//   "improvements": [
//     {
//       "area": "Focus management",
//       "suggestion": "Implement focus trap for modal dialogs",
//       "impact": "Improves keyboard navigation experience"
//     }
//   ]
// }
// \`\`\``;

// /**
//  * Prompt for performance optimization suggestions
//  */
// export const PERFORMANCE_AUDIT_PROMPT = `You are a frontend performance expert. Analyze the provided UI description and component structure for performance optimization opportunities.

// **UI Analysis:**
// {description}

// **Component Structure:**
// {components}

// **Audit Focus:**
// 1. **Bundle Size** - Identify potential code splitting opportunities
// 2. **Rendering Performance** - Detect expensive re-renders
// 3. **Image Optimization** - Suggest image handling improvements
// 4. **Memory Usage** - Identify potential memory leaks
// 5. **Loading Strategies** - Recommend lazy loading patterns
// 6. **Caching** - Suggest caching strategies

// **Response Format:**
// \`\`\`json
// {
//   "performanceScore": 78,
//   "optimizations": [
//     {
//       "category": "bundle-size|rendering|images|memory|loading|caching",
//       "priority": "high|medium|low",
//       "issue": "Description of performance issue",
//       "solution": "Recommended solution",
//       "impact": "Expected performance improvement"
//     }
//   ],
//   "metrics": {
//     "estimatedBundleSize": "250KB",
//     "criticalComponents": ["DataTable", "ImageGallery"],
//     "lazyLoadCandidates": ["Charts", "LargeList"]
//   }
// }
// \`\`\``;

// /**
//  * Helper function to format prompts with context
//  */
// export function formatPrompt(
//   template: string,
//   context: Record<string, any>
// ): string {
//   let formatted = template;

//   Object.entries(context).forEach(([key, value]) => {
//     const placeholder = `{${key}}`;
//     const replacement =
//       typeof value === "object"
//         ? JSON.stringify(value, null, 2)
//         : String(value);
//     formatted = formatted.replace(
//       new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
//       replacement
//     );
//   });

//   return formatted;
// }

// /**
//  * Get prompt for specific task
//  */
// export function getPrompt(
//   task: "guidance" | "code" | "conversion" | "accessibility" | "performance",
//   context: any
// ): string {
//   switch (task) {
//     case "guidance":
//       return formatPrompt(GUIDANCE_PROMPT, context);
//     case "code":
//       return formatPrompt(CODE_GENERATION_PROMPT, context);
//     case "conversion":
//       return formatPrompt(FRAMEWORK_CONVERSION_PROMPT, context);
//     case "accessibility":
//       return formatPrompt(ACCESSIBILITY_AUDIT_PROMPT, context);
//     case "performance":
//       return formatPrompt(PERFORMANCE_AUDIT_PROMPT, context);
//     default:
//       throw new Error(`Unknown prompt task: ${task}`);
//   }
// }

// /**
//  * Default context values
//  */
// export const DEFAULT_CONTEXT: Partial<PromptContext> = {
//   framework: "next",
//   complexity: "medium",
//   includeAccessibility: true,
//   userPreferences: {
//     styleLibrary: "mui",
//     typescript: true,
//     responsive: true,
//   },
// };

// lib/prompts.ts
import { GuidanceResponse } from "./types";

// Main guidance generation prompt
export const GUIDANCE_PROMPT = `You are an expert frontend developer and UI architect. Analyze the provided UI description and generate comprehensive development guidance.

Context:
- Framework: {framework}
- Complexity Level: {complexity}
- Include Accessibility: {includeAccessibility}

UI Description: {description}

Generate a detailed JSON response with this EXACT structure:

{
  "pageType": "string (Login, Dashboard, Landing, Form, Profile, etc.)",
  "folderStructure": [
    "components/",
    "├── layout/",
    "├── ui/",
    "├── forms/",
    "pages/",
    "styles/",
    "utils/",
    "lib/"
  ],
  "components": [
    {
      "name": "ComponentName",
      "count": 1,
      "description": "Brief component description",
      "props": ["prop1", "prop2", "prop3"]
    }
  ],
  "complexity": {
    "level": "simple|medium|complex",
    "estimatedHours": 4,
    "factors": [
      "Component complexity",
      "State management requirements",
      "Styling complexity"
    ]
  },
  "snippets": [
    {
      "id": "unique-id",
      "name": "Component Name",
      "framework": "{framework}",
      "code": "const Component = () => { return <div>...</div>; }"
    }
  ],
  "styling": {
    "muiProps": {
      "Paper": {"elevation": 2, "sx": {"borderRadius": 2}},
      "Typography": {"variant": "h6", "color": "primary"}
    },
    "tailwindAlternatives": ["shadow-md", "rounded-lg", "bg-white"],
    "responsive": {"xs": 12, "md": 8, "lg": 6}
  },
  "accessibility": [
    "Add ARIA labels for interactive elements",
    "Ensure keyboard navigation support",
    "Maintain sufficient color contrast"
  ]
}

Guidelines:
- Keep code snippets short (3-10 lines)
- Rate complexity realistically (simple=1-2h, medium=3-6h, complex=8+h)
- Include only necessary dependencies
- Focus on Material-UI components
- Suggest modern React patterns`;

// Code generation prompt
export const CODE_GENERATION_PROMPT = `You are a senior React developer. Generate production-ready component code based on this specification:

Component: {componentName}
Description: {componentDescription}
Framework: {framework}
Props: {componentProps}
Context: {pageContext}

Requirements:
- Use TypeScript with proper interfaces
- Use Material-UI components and sx prop
- Include proper imports and exports
- Add JSDoc comments
- Follow React best practices
- Include error handling
- Add accessibility attributes
- Use functional components with hooks

Return ONLY the complete component code without markdown formatting or explanations.`;

// Test generation prompt
export const TEST_GENERATION_PROMPT = `Generate comprehensive Jest tests for a React component:

Component: {componentName}
Description: {componentDescription}
Props: {componentProps}

Include these test cases:
- Basic render test
- Props validation
- User interaction tests
- Accessibility tests
- Error state handling

Use @testing-library/react and modern testing practices.
Return ONLY the complete test code without markdown formatting.`;

// Style generation prompt
export const STYLE_GENERATION_PROMPT = `Generate Material-UI styled component definitions:

Component: {componentName}
Description: {componentDescription}
Theme: Material-UI default theme

Create sx prop objects for different component states:
- Default state
- Hover state
- Active/selected state
- Disabled state
- Responsive variants

Return TypeScript-compatible style objects using SxProps.`;

// Framework conversion prompt
export const FRAMEWORK_CONVERSION_PROMPT = `Convert this React component from {sourceFramework} to {targetFramework}:

{sourceCode}

Conversion requirements:
- Maintain exact functionality
- Update imports appropriately
- Follow {targetFramework} best practices
- Convert routing if needed
- Update build configuration

Return the converted code with proper syntax for {targetFramework}.`;

// Accessibility audit prompt
export const ACCESSIBILITY_AUDIT_PROMPT = `Audit this UI description for accessibility compliance:

UI Description: {description}

Evaluate against WCAG 2.1 AA standards:
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management
- Semantic HTML
- Form accessibility
- Error handling

Provide JSON response:
{
  "score": 85,
  "issues": [
    {
      "severity": "high|medium|low",
      "category": "keyboard|screen-reader|contrast|focus|semantic|forms",
      "description": "Issue description",
      "solution": "How to fix",
      "wcagReference": "WCAG guideline"
    }
  ],
  "recommendations": [
    "Specific improvement suggestions"
  ]
}`;

// Enhanced prompt templates
export const PROMPTS = {
  guidance: GUIDANCE_PROMPT,
  codeGeneration: CODE_GENERATION_PROMPT,
  testGeneration: TEST_GENERATION_PROMPT,
  styleGeneration: STYLE_GENERATION_PROMPT,
  conversion: FRAMEWORK_CONVERSION_PROMPT,
  accessibility: ACCESSIBILITY_AUDIT_PROMPT,
};

// Prompt formatting utility
export function formatPrompt(
  template: string,
  context: Record<string, any>
): string {
  let formatted = template;

  Object.entries(context).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    const replacement =
      typeof value === "object"
        ? JSON.stringify(value, null, 2)
        : String(value);
    formatted = formatted.replaceAll(placeholder, replacement);
  });

  return formatted;
}

// Get specific prompt
export function getPrompt(
  type: keyof typeof PROMPTS,
  context: Record<string, any>
): string {
  const template = PROMPTS[type];
  if (!template) {
    throw new Error(`Unknown prompt type: ${type}`);
  }
  return formatPrompt(template, context);
}

// Default context values
export const DEFAULT_CONTEXT = {
  framework: "next",
  complexity: "medium",
  includeAccessibility: true,
  userPreferences: {
    styleLibrary: "mui",
    typescript: true,
    responsive: true,
  },
};

// System prompts for different AI providers
export const SYSTEM_PROMPTS = {
  openrouter: {
    guidance:
      "You are an expert frontend developer specializing in React, Next.js, and Material-UI. Provide structured development guidance in JSON format.",
    codeGen:
      "You are a senior React developer. Generate clean, production-ready TypeScript components using Material-UI.",
    conversion:
      "You are a framework expert. Convert code between React frameworks maintaining functionality and best practices.",
  },

  fallback: {
    guidance: "Analyze UI and provide development guidance",
    codeGen: "Generate React component code",
    conversion: "Convert code between frameworks",
  },
};

// Validation functions
export function validateGuidanceResponse(response: any): boolean {
  const required = ["pageType", "folderStructure", "components", "complexity"];
  return required.every((field) => response.hasOwnProperty(field));
}

export function validateCodeResponse(response: any): boolean {
  return typeof response === "string" && response.length > 0;
}

// Response parsers
export function parseGuidanceResponse(
  rawResponse: string
): GuidanceResponse | null {
  try {
    // Extract JSON from markdown code blocks
    const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;

    const parsed = JSON.parse(jsonString);

    if (validateGuidanceResponse(parsed)) {
      return parsed as GuidanceResponse;
    }

    return null;
  } catch (error) {
    console.error("Failed to parse guidance response:", error);
    return null;
  }
}

export function parseCodeResponse(rawResponse: string): string {
  // Remove markdown code blocks if present
  const codeMatch = rawResponse.match(
    /```(?:typescript|tsx|jsx)?\s*([\s\S]*?)\s*```/
  );
  return codeMatch ? codeMatch[1].trim() : rawResponse.trim();
}

// Prompt improvement suggestions
export const PROMPT_TIPS = {
  guidance: [
    "Be specific about UI elements and layout",
    "Mention target devices (mobile, desktop, tablet)",
    "Include any specific functionality requirements",
    "Specify styling preferences (modern, minimal, colorful)",
  ],

  codeGeneration: [
    "Provide clear component requirements",
    "Specify any state management needs",
    "Include API integration requirements",
    "Mention performance considerations",
  ],

  conversion: [
    "Ensure source code is complete and functional",
    "Specify target framework version",
    "Include any migration-specific requirements",
    "Mention breaking changes to handle",
  ],
};

// Error messages for failed prompts
export const PROMPT_ERRORS = {
  invalidResponse: "AI returned invalid response format",
  networkError: "Failed to connect to AI service",
  rateLimitExceeded: "Too many requests, please try again later",
  insufficientContext: "Not enough information provided",
  unsupportedFramework: "Framework not supported",
  malformedRequest: "Request format is invalid",
};

// Retry configuration for failed prompts
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  backoffMultiplier: 2,
  retryableErrors: ["networkError", "rateLimitExceeded"],
};
