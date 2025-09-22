// LLM Prompt templates for the AI-powered Frontend Helper

export interface PromptContext {
  description: string;
  framework?: "react" | "next" | "vue" | "angular";
  complexity?: "simple" | "medium" | "complex";
  includeAccessibility?: boolean;
  includeTests?: boolean;
  userPreferences?: {
    styleLibrary?: "mui" | "tailwind" | "styled-components" | "css";
    typescript?: boolean;
    responsive?: boolean;
  };
}

export interface ComponentInfo {
  name: string;
  count: number;
  description: string;
  complexity: 1 | 2 | 3 | 4 | 5;
  dependencies?: string[];
  props?: string[];
}

export interface GuidanceResponse {
  pageType: string;
  folderStructure: Record<string, string[]>;
  components: ComponentInfo[];
  codeSnippets: Array<{
    title: string;
    code: string;
    language: string;
    description: string;
  }>;
  complexity: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  accessibility: string[];
  recommendations: string[];
  dependencies: string[];
}

/**
 * Main prompt for generating development guidance from UI descriptions
 */
export const GUIDANCE_PROMPT = `You are an expert frontend developer and UI architect. Analyze the provided UI description and generate comprehensive development guidance.

**Context:**
- Framework: {framework}
- Complexity Level: {complexity}
- Include Accessibility: {includeAccessibility}
- User Preferences: {userPreferences}

**UI Description:**
{description}

**Instructions:**
1. Identify the page/component type (Login, Dashboard, Landing, Form, etc.)
2. Break down into logical components with complexity ratings (1-5 scale)
3. Suggest folder structure following best practices
4. Provide small, focused code snippets (3-10 lines each)
5. Estimate development time and complexity
6. Include accessibility considerations
7. Recommend best practices and potential pitfalls

**Required JSON Response Format:**
\`\`\`json
{
  "pageType": "string",
  "folderStructure": {
    "components/": ["List of component files"],
    "hooks/": ["Custom hooks if needed"],
    "utils/": ["Utility functions"],
    "types/": ["TypeScript definitions"],
    "styles/": ["Style files"]
  },
  "components": [
    {
      "name": "ComponentName",
      "count": 1,
      "description": "Brief description",
      "complexity": 3,
      "dependencies": ["@mui/material", "react-hook-form"],
      "props": ["title", "onSubmit", "disabled"]
    }
  ],
  "codeSnippets": [
    {
      "title": "Component Structure",
      "code": "const Component = () => { return <div>...</div>; }",
      "language": "typescript",
      "description": "Basic component setup"
    }
  ],
  "complexity": 3,
  "estimatedTime": "2-4 hours",
  "accessibility": [
    "Add ARIA labels for form inputs",
    "Ensure keyboard navigation support"
  ],
  "recommendations": [
    "Use form validation library",
    "Implement error boundaries"
  ],
  "dependencies": [
    "@mui/material",
    "react-hook-form",
    "@hookform/resolvers"
  ]
}
\`\`\`

**Important Guidelines:**
- Keep code snippets short and focused (max 10 lines)
- Rate complexity realistically (1=very simple, 5=very complex)
- Include only necessary dependencies
- Consider responsive design patterns
- Suggest modern React patterns (hooks, functional components)
- Include TypeScript types when applicable`;

/**
 * Prompt for generating complete code files
 */
export const CODE_GENERATION_PROMPT = `You are a senior frontend developer. Generate production-ready code based on the provided guidance.

**Development Guidance:**
{guidance}

**Requirements:**
- Target Framework: {targetFramework}
- Include Tests: {includeTests}
- Include Styles: {includeStyles}
- TypeScript: {useTypeScript}

**Instructions:**
1. Generate complete, functional components
2. Include proper imports and exports
3. Add comprehensive TypeScript types
4. Implement responsive design patterns
5. Follow framework best practices
6. Include error handling and loading states
7. Add meaningful comments for complex logic
8. Generate corresponding test files if requested

**Code Quality Standards:**
- Use modern React patterns (hooks, functional components)
- Implement proper prop validation
- Add accessibility attributes (ARIA labels, roles)
- Include error boundaries where appropriate
- Use semantic HTML elements
- Implement keyboard navigation support
- Add loading and error states
- Follow consistent naming conventions

**Response Format:**
Generate an array of file objects with proper TypeScript/JSX code:

\`\`\`json
{
  "files": [
    {
      "path": "components/LoginForm.tsx",
      "content": "// Complete component code here",
      "type": "component",
      "description": "Main login form component"
    },
    {
      "path": "components/LoginForm.test.tsx",
      "content": "// Jest test file",
      "type": "test",
      "description": "Unit tests for LoginForm"
    }
  ],
  "dependencies": {
    "dependencies": ["@mui/material", "react-hook-form"],
    "devDependencies": ["@testing-library/react", "@types/jest"]
  }
}
\`\`\``;

/**
 * Prompt for framework conversion
 */
export const FRAMEWORK_CONVERSION_PROMPT = `You are a frontend architecture expert. Convert the provided code from {sourceFramework} to {targetFramework}.

**Source Code:**
{sourceCode}

**Conversion Requirements:**
- Maintain exact functionality
- Follow {targetFramework} best practices
- Update imports and syntax appropriately
- Preserve component logic and state management
- Convert styling approach if needed
- Update routing patterns if applicable

**Framework-Specific Considerations:**

**React to Next.js:**
- Add 'use client' directive for client components
- Use Next.js routing conventions
- Implement proper page components
- Add SEO metadata where appropriate

**React to Vue:**
- Convert JSX to Vue template syntax
- Use Vue Composition API
- Convert props and events appropriately
- Update lifecycle methods

**Next.js to React:**
- Remove Next.js specific imports
- Convert pages to regular components
- Update routing to React Router
- Remove server-side specific code

Provide the converted code maintaining the same structure and functionality.`;

/**
 * Prompt for accessibility audit
 */
export const ACCESSIBILITY_AUDIT_PROMPT = `You are a web accessibility expert (WCAG 2.1 AA certified). Audit the provided UI description for accessibility issues and recommendations.

**UI Description:**
{description}

**Audit Areas:**
1. **Keyboard Navigation** - Can all interactive elements be accessed via keyboard?
2. **Screen Reader Support** - Are proper ARIA labels and roles present?
3. **Color Contrast** - Is text readable against backgrounds?
4. **Focus Management** - Is focus handled properly for dynamic content?
5. **Semantic HTML** - Are proper HTML elements used?
6. **Form Accessibility** - Are form fields properly labeled?
7. **Error Handling** - Are errors announced to assistive technology?

**Response Format:**
\`\`\`json
{
  "score": 85,
  "issues": [
    {
      "severity": "high|medium|low",
      "category": "keyboard|screen-reader|contrast|focus|semantic|forms|errors",
      "description": "Issue description",
      "recommendation": "How to fix",
      "wcagReference": "WCAG 2.1 AA guideline reference"
    }
  ],
  "improvements": [
    {
      "area": "Focus management",
      "suggestion": "Implement focus trap for modal dialogs",
      "impact": "Improves keyboard navigation experience"
    }
  ]
}
\`\`\``;

/**
 * Prompt for performance optimization suggestions
 */
export const PERFORMANCE_AUDIT_PROMPT = `You are a frontend performance expert. Analyze the provided UI description and component structure for performance optimization opportunities.

**UI Analysis:**
{description}

**Component Structure:**
{components}

**Audit Focus:**
1. **Bundle Size** - Identify potential code splitting opportunities
2. **Rendering Performance** - Detect expensive re-renders
3. **Image Optimization** - Suggest image handling improvements
4. **Memory Usage** - Identify potential memory leaks
5. **Loading Strategies** - Recommend lazy loading patterns
6. **Caching** - Suggest caching strategies

**Response Format:**
\`\`\`json
{
  "performanceScore": 78,
  "optimizations": [
    {
      "category": "bundle-size|rendering|images|memory|loading|caching",
      "priority": "high|medium|low",
      "issue": "Description of performance issue",
      "solution": "Recommended solution",
      "impact": "Expected performance improvement"
    }
  ],
  "metrics": {
    "estimatedBundleSize": "250KB",
    "criticalComponents": ["DataTable", "ImageGallery"],
    "lazyLoadCandidates": ["Charts", "LargeList"]
  }
}
\`\`\``;

/**
 * Helper function to format prompts with context
 */
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
    formatted = formatted.replace(
      new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
      replacement
    );
  });

  return formatted;
}

/**
 * Get prompt for specific task
 */
export function getPrompt(
  task: "guidance" | "code" | "conversion" | "accessibility" | "performance",
  context: any
): string {
  switch (task) {
    case "guidance":
      return formatPrompt(GUIDANCE_PROMPT, context);
    case "code":
      return formatPrompt(CODE_GENERATION_PROMPT, context);
    case "conversion":
      return formatPrompt(FRAMEWORK_CONVERSION_PROMPT, context);
    case "accessibility":
      return formatPrompt(ACCESSIBILITY_AUDIT_PROMPT, context);
    case "performance":
      return formatPrompt(PERFORMANCE_AUDIT_PROMPT, context);
    default:
      throw new Error(`Unknown prompt task: ${task}`);
  }
}

/**
 * Default context values
 */
export const DEFAULT_CONTEXT: Partial<PromptContext> = {
  framework: "next",
  complexity: "medium",
  includeAccessibility: true,
  userPreferences: {
    styleLibrary: "mui",
    typescript: true,
    responsive: true,
  },
};
