// // // lib/utils.ts
// // import { VisionResponse, GuidanceResponse, ApiResponse } from "./types";

// // export class ApiClient {
// //   private baseUrl = "/api";

// //   async analyzeImage(imageFile: File): Promise<{
// //     text: string;
// //     ocr: { text: string; confidence: number };
// //     vision: { description: string; confidence: number };
// //   }> {
// //     const formData = new FormData();
// //     formData.append("image", imageFile);

// //     const response = await fetch(`${this.baseUrl}/vision`, {
// //       method: "POST",
// //       body: formData,
// //     });

// //     if (!response.ok) {
// //       const error = await response.text();
// //       throw new Error(`Vision API error: ${error}`);
// //     }

// //     const result: ApiResponse<VisionResponse> = await response.json();

// //     if (!result.success) {
// //       throw new Error(result.error || "Failed to analyze image");
// //     }

// //     return {
// //       text: result.data?.merged || "Unable to analyze image",
// //       ocr: result.data?.ocr || { text: "", confidence: 0 },
// //       vision: result.data?.vision || { description: "", confidence: 0 },
// //     };
// //   }

// //   async generateGuidance(
// //     description: string,
// //     framework: string = "next",
// //     complexity: string = "medium",
// //     options: any = {}
// //   ): Promise<GuidanceResponse> {
// //     const response = await fetch(`${this.baseUrl}/generate-guidance`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         description,
// //         framework,
// //         complexity,
// //         includeAccessibility: true,
// //         options,
// //       }),
// //     });

// //     if (!response.ok) {
// //       const error = await response.text();
// //       throw new Error(`Guidance API error: ${error}`);
// //     }

// //     const result: ApiResponse<GuidanceResponse> = await response.json();

// //     if (!result.success) {
// //       throw new Error(result.error || "Failed to generate guidance");
// //     }

// //     return result.data!;
// //   }

// //   async generateCode(
// //     guidance: GuidanceResponse,
// //     targetFramework: string = "next",
// //     options: any = {}
// //   ): Promise<any> {
// //     const response = await fetch(`${this.baseUrl}/generate-code`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         guidance,
// //         targetFramework,
// //         includeTests: true,
// //         includeStyles: true,
// //         options,
// //       }),
// //     });

// //     if (!response.ok) {
// //       const error = await response.text();
// //       throw new Error(`Code generation API error: ${error}`);
// //     }

// //     const result = await response.json();

// //     if (!result.success) {
// //       throw new Error(result.error || "Failed to generate code");
// //     }

// //     return result;
// //   }
// // }

// // export const apiClient = new ApiClient();

// // // Utility functions
// // export function generateId(): string {
// //   return Math.random().toString(36).substr(2, 9);
// // }

// // export function formatDate(date: Date): string {
// //   return date.toLocaleTimeString("en-US", {
// //     hour: "2-digit",
// //     minute: "2-digit",
// //   });
// // }

// // export function truncateText(text: string, maxLength: number): string {
// //   if (text.length <= maxLength) return text;
// //   return text.substr(0, maxLength) + "...";
// // }

// // lib/utils.ts
// import { VisionResponse, GuidanceResponse, ApiResponse } from "./types";

// export class ApiClient {
//   private baseUrl = "/api";

//   async analyzeImage(imageFile: File): Promise<{
//     text: string;
//     ocr: { text: string; confidence: number };
//     vision: { description: string; confidence: number };
//   }> {
//     try {
//       const formData = new FormData();
//       formData.append("image", imageFile);

//       const response = await fetch(`${this.baseUrl}/vision`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Vision API error (${response.status}): ${errorText}`);
//       }

//       const result: ApiResponse<VisionResponse> = await response.json();

//       if (!result.success) {
//         throw new Error(result.error || "Failed to analyze image");
//       }

//       const data = result.data!;
//       return {
//         text: data.merged || "Unable to analyze image",
//         ocr: data.ocr || { text: "", confidence: 0 },
//         vision: data.vision || { description: "", confidence: 0 },
//       };
//     } catch (error) {
//       console.error("Image analysis error:", error);

//       // Return fallback response instead of throwing
//       return {
//         text: `Image uploaded: ${imageFile.name}. Please describe what you see in this UI design.`,
//         ocr: { text: "", confidence: 0 },
//         vision: {
//           description: "Image analysis temporarily unavailable",
//           confidence: 0,
//         },
//       };
//     }
//   }

//   async generateGuidance(
//     description: string,
//     framework: string = "next",
//     complexity: string = "medium",
//     options: any = {}
//   ): Promise<GuidanceResponse> {
//     try {
//       const response = await fetch(`${this.baseUrl}/generate-guidance`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           description,
//           framework,
//           complexity,
//           includeAccessibility: true,
//           options,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Guidance API error (${response.status}): ${errorText}`
//         );
//       }

//       const result: ApiResponse<GuidanceResponse> = await response.json();

//       if (!result.success) {
//         throw new Error(result.error || "Failed to generate guidance");
//       }

//       return result.data!;
//     } catch (error) {
//       console.error("Guidance generation error:", error);

//       // Return intelligent fallback based on description
//       return this.generateIntelligentFallback(
//         description,
//         framework,
//         complexity
//       );
//     }
//   }

//   async generateCode(
//     guidance: GuidanceResponse,
//     targetFramework: string = "next",
//     options: any = {}
//   ): Promise<any> {
//     try {
//       const response = await fetch(`${this.baseUrl}/generate-code`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           guidance,
//           targetFramework,
//           includeTests: true,
//           includeStyles: true,
//           options,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Code generation API error (${response.status}): ${errorText}`
//         );
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.error || "Failed to generate code");
//       }

//       return result;
//     } catch (error) {
//       console.error("Code generation error:", error);
//       throw error;
//     }
//   }

//   private generateIntelligentFallback(
//     description: string,
//     framework: string,
//     complexity: string
//   ): GuidanceResponse {
//     const desc = description.toLowerCase();

//     // Detect page type from description
//     let pageType = "Page";
//     let components: any[] = [];

//     if (
//       desc.includes("login") ||
//       desc.includes("signin") ||
//       desc.includes("auth")
//     ) {
//       pageType = "Login";
//       components = [
//         {
//           name: "LoginForm",
//           count: 1,
//           description: "Email and password form",
//           props: ["onSubmit", "loading"],
//         },
//         {
//           name: "InputField",
//           count: 2,
//           description: "Email and password inputs",
//           props: ["label", "type", "value", "onChange"],
//         },
//         {
//           name: "SubmitButton",
//           count: 1,
//           description: "Login submit button",
//           props: ["loading", "disabled"],
//         },
//       ];
//     } else if (desc.includes("dashboard") || desc.includes("admin")) {
//       pageType = "Dashboard";
//       components = [
//         {
//           name: "Header",
//           count: 1,
//           description: "Navigation header",
//           props: ["user", "onLogout"],
//         },
//         {
//           name: "Sidebar",
//           count: 1,
//           description: "Navigation sidebar",
//           props: ["items", "collapsed"],
//         },
//         {
//           name: "StatCard",
//           count: 4,
//           description: "Metric display cards",
//           props: ["title", "value", "trend"],
//         },
//         {
//           name: "Chart",
//           count: 2,
//           description: "Data visualization",
//           props: ["data", "type"],
//         },
//       ];
//     } else if (desc.includes("landing") || desc.includes("hero")) {
//       pageType = "Landing";
//       components = [
//         {
//           name: "HeroSection",
//           count: 1,
//           description: "Main hero banner",
//           props: ["title", "subtitle", "cta"],
//         },
//         {
//           name: "FeatureCard",
//           count: 3,
//           description: "Feature highlights",
//           props: ["icon", "title", "description"],
//         },
//         {
//           name: "CTAButton",
//           count: 2,
//           description: "Call to action buttons",
//           props: ["variant", "onClick"],
//         },
//       ];
//     } else if (desc.includes("form") || desc.includes("input")) {
//       pageType = "Form";
//       components = [
//         {
//           name: "FormContainer",
//           count: 1,
//           description: "Form wrapper",
//           props: ["onSubmit", "validation"],
//         },
//         {
//           name: "FormField",
//           count: 1,
//           description: "Reusable input component",
//           props: ["label", "type", "validation"],
//         },
//         {
//           name: "SubmitButton",
//           count: 1,
//           description: "Form submit button",
//           props: ["loading", "disabled"],
//         },
//       ];
//     } else if (
//       desc.includes("table") ||
//       desc.includes("list") ||
//       desc.includes("data")
//     ) {
//       pageType = "DataDisplay";
//       components = [
//         {
//           name: "DataTable",
//           count: 1,
//           description: "Data display table",
//           props: ["data", "columns", "pagination"],
//         },
//         {
//           name: "FilterBar",
//           count: 1,
//           description: "Search and filter controls",
//           props: ["onFilter", "options"],
//         },
//         {
//           name: "Pagination",
//           count: 1,
//           description: "Page navigation",
//           props: ["page", "total", "onChange"],
//         },
//       ];
//     } else {
//       // Generic components based on common UI elements
//       components = [
//         {
//           name: "MainLayout",
//           count: 1,
//           description: "Page layout container",
//           props: ["children"],
//         },
//         {
//           name: "ContentSection",
//           count: 1,
//           description: "Main content area",
//           props: ["title", "children"],
//         },
//       ];
//     }

//     const estimatedHours =
//       complexity === "simple" ? 2 : complexity === "medium" ? 4 : 8;

//     return {
//       pageType,
//       folderStructure: [
//         "components/",
//         "├── ui/",
//         "├── layout/",
//         "├── forms/",
//         "pages/",
//         "styles/",
//         "utils/",
//         "lib/",
//         "hooks/",
//       ],
//       components,
//       complexity: {
//         level: complexity as "simple" | "medium" | "complex",
//         estimatedHours,
//         factors: [
//           "Component structure",
//           "State management",
//           "Styling complexity",
//           "Responsive design",
//         ],
//       },
//       snippets: [
//         {
//           id: "1",
//           name: `${pageType}Page`,
//           framework,
//           code: `import { Box, Typography, Paper } from '@mui/material';

// const ${pageType}Page = () => {
//   return (
//     <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
//       <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
//         <Typography variant="h4" gutterBottom>
//           ${pageType}
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           ${pageType} page implementation
//         </Typography>
//         {/* Add your ${pageType.toLowerCase()} content here */}
//       </Paper>
//     </Box>
//   );
// };

// export default ${pageType}Page;`,
//         },
//       ],
//       styling: {
//         muiProps: {
//           Paper: { elevation: 2, sx: { borderRadius: 2, p: 3 } },
//           Typography: { variant: "h6", color: "primary" },
//           Button: { variant: "contained", sx: { borderRadius: 2 } },
//         },
//         tailwindAlternatives: ["shadow-md", "rounded-lg", "bg-white", "p-6"],
//         responsive: { xs: 12, md: 8, lg: 6 },
//       },
//       accessibility: [
//         "Add ARIA labels for interactive elements",
//         "Ensure keyboard navigation support",
//         "Maintain sufficient color contrast (4.5:1)",
//         "Use semantic HTML elements",
//         "Provide focus indicators",
//         "Add alt text for images",
//       ],
//     };
//   }
// }

// export const apiClient = new ApiClient();

// // Utility functions
// export function generateId(): string {
//   return Math.random().toString(36).substr(2, 9);
// }

// export function formatDate(date: Date): string {
//   return date.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// export function truncateText(text: string, maxLength: number): string {
//   if (text.length <= maxLength) return text;
//   return text.substr(0, maxLength) + "...";
// }

// // File type validation
// export function validateImageFile(file: File): string | null {
//   const maxSize = 10 * 1024 * 1024; // 10MB
//   const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

//   if (!allowedTypes.includes(file.type)) {
//     return `Invalid file type. Please upload: ${allowedTypes
//       .map((t) => t.split("/")[1].toUpperCase())
//       .join(", ")}`;
//   }

//   if (file.size > maxSize) {
//     return "File too large. Maximum size is 10MB.";
//   }

//   return null;
// }

// lib/utils.ts - API Client Methods

import {
  VisionAnalysisResponse,
  CodeGenerationResponse,
  GuidanceTutorialResponse,
  CodeGenerationRequest,
  ApiResponse,
} from "./types";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Analyze an uploaded image
   */
  async analyzeImage(
    image: File,
    prompt?: string
  ): Promise<VisionAnalysisResponse> {
    const formData = new FormData();
    formData.append("image", image);
    if (prompt) {
      formData.append("prompt", prompt);
    }

    const response = await fetch(`${this.baseUrl}/vision`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to analyze image");
    }

    const result: ApiResponse<VisionAnalysisResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid response from vision API");
    }

    return result.data;
  }

  /**
   * Generate code based on prompt
   */
  async generateCode(
    request: CodeGenerationRequest
  ): Promise<CodeGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/generate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate code");
    }

    const result: ApiResponse<CodeGenerationResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid response from code generation API");
    }

    return result.data;
  }

  /**
   * Generate learning guidance
   */
  async generateGuidance(
    prompt: string,
    language?: string,
    framework?: string
  ): Promise<GuidanceTutorialResponse> {
    const response = await fetch(`${this.baseUrl}/generate-guidance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        language,
        framework,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate guidance");
    }

    const result: ApiResponse<GuidanceTutorialResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid response from guidance API");
    }

    return result.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export function validateImageFile(file: File): string | null {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Please upload: ${allowedTypes
      .map((t) => t.split("/")[1].toUpperCase())
      .join(", ")}`;
  }

  if (file.size > maxSize) {
    return "File too large. Maximum size is 10MB.";
  }

  return null;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function getLanguageFromExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const languageMap: { [key: string]: string } = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    md: "markdown",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
  };
  return languageMap[ext || ""] || "typescript";
}
