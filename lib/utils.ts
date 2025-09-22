import { GuidanceResponse, ComponentInfo } from "./prompts";

// Type definitions for utility functions
export interface FileStructure {
  path: string;
  content: string;
  type: "component" | "test" | "style" | "config" | "util" | "type";
  description?: string;
}

export interface ProjectStructure {
  name: string;
  files: FileStructure[];
  dependencies: string[];
  devDependencies: string[];
}

export interface AnalysisMetrics {
  complexity: number;
  estimatedTime: string;
  componentCount: number;
  dependencyCount: number;
  accessibilityScore: number;
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate unique ID for components, files, etc.
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Throttle function for scroll and resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone object utility
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;

  const cloned = {} as T;
  Object.keys(obj).forEach((key) => {
    (cloned as any)[key] = deepClone((obj as any)[key]);
  });

  return cloned;
}

/**
 * Validate image file type and size
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes
        .map((t) => t.split("/")[1])
        .join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(maxSize)}`,
    };
  }

  return { valid: true };
}

/**
 * Extract dominant colors from image (requires canvas)
 */
export function extractImageColors(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractColorsFromImageData(imageData);
      resolve(colors);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/**
 * Extract colors from image data
 */
function extractColorsFromImageData(imageData: ImageData): string[] {
  const data = imageData.data;
  const colorMap: Record<string, number> = {};

  // Sample pixels (every 4th pixel for performance)
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    if (alpha < 128) continue; // Skip transparent pixels

    const color = `rgb(${r},${g},${b})`;
    colorMap[color] = (colorMap[color] || 0) + 1;
  }

  // Sort by frequency and return top 5 colors
  return Object.entries(colorMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([color]) => color);
}

/**
 * Calculate complexity score based on components
 */
export function calculateComplexityScore(components: ComponentInfo[]): number {
  if (!components.length) return 1;

  const totalComplexity = components.reduce(
    (sum, comp) => sum + comp.complexity,
    0
  );
  const avgComplexity = totalComplexity / components.length;
  const componentCount = components.length;

  // Factor in component count and average complexity
  let score = avgComplexity;
  if (componentCount > 10) score += 1;
  if (componentCount > 20) score += 1;

  return Math.min(Math.max(Math.round(score), 1), 5);
}

/**
 * Estimate development time based on complexity and component count
 */
export function estimateDevTime(guidance: GuidanceResponse): string {
  const { complexity, components } = guidance;
  const componentCount = components.length;

  // Base time per complexity level (in hours)
  const baseTime = {
    1: 1, // Simple: 1 hour
    2: 2, // Easy: 2 hours
    3: 4, // Medium: 4 hours
    4: 8, // Complex: 8 hours
    5: 16, // Very Complex: 16 hours
  };

  const base = baseTime[complexity as keyof typeof baseTime] || 4;
  const componentMultiplier = Math.max(componentCount * 0.5, 1);
  const totalHours = Math.round(base * componentMultiplier);

  if (totalHours < 2) return "1-2 hours";
  if (totalHours < 8)
    return `${Math.floor(totalHours / 2) * 2}-${totalHours} hours`;
  if (totalHours < 24)
    return `${Math.floor(totalHours / 4) * 4}-${totalHours} hours`;

  const days = Math.ceil(totalHours / 8);
  return `${days - 1}-${days} days`;
}

/**
 * Generate folder structure from guidance
 */
export function generateFolderStructure(
  guidance: GuidanceResponse
): Record<string, string[]> {
  const structure: Record<string, string[]> = {
    "components/": [],
    "hooks/": [],
    "utils/": [],
    "types/": [],
    "styles/": [],
  };

  // Add components to structure
  guidance.components.forEach((comp) => {
    structure["components/"].push(`${comp.name}.tsx`);
    if (comp.complexity >= 3) {
      structure["components/"].push(`${comp.name}.test.tsx`);
      structure["styles/"].push(`${comp.name}.styles.ts`);
    }
  });

  // Add common utilities
  structure["utils/"].push("helpers.ts", "constants.ts");
  structure["types/"].push("index.ts", `${guidance.pageType.toLowerCase()}.ts`);

  // Add hooks if needed
  if (guidance.complexity >= 3) {
    structure["hooks/"].push("useLocalStorage.ts", "useDebounce.ts");
  }

  return structure;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        return true;
      } catch (error) {
        return false;
      } finally {
        textArea.remove();
      }
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Download file with given content
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download multiple files as ZIP (requires JSZip)
 */
export async function downloadProjectFiles(
  project: ProjectStructure
): Promise<void> {
  // Note: This requires JSZip library to be installed
  // For now, we'll download individual files
  project.files.forEach((file, index) => {
    setTimeout(() => {
      downloadFile(
        file.content,
        file.path.split("/").pop() || `file_${index}.txt`,
        "text/plain"
      );
    }, index * 500); // Stagger downloads
  });
}

/**
 * Parse and validate JSON response from LLM
 */
export function parseJsonResponse<T>(response: string): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;

    const data = JSON.parse(jsonString) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid JSON response",
    };
  }
}

/**
 * Format component name to follow naming conventions
 */
export function formatComponentName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Generate package.json content based on dependencies
 */
export function generatePackageJson(
  projectName: string,
  dependencies: string[],
  devDependencies: string[] = [],
  framework: "react" | "next" | "vue" = "next"
): string {
  const basePackage = {
    name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    version: "1.0.0",
    private: true,
    description: "Generated by AI Frontend Helper",
  };

  const scripts = {
    react: {
      dev: "react-scripts start",
      build: "react-scripts build",
      test: "react-scripts test",
      eject: "react-scripts eject",
    },
    next: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      test: "jest",
      "test:watch": "jest --watch",
    },
    vue: {
      dev: "vite dev",
      build: "vite build",
      preview: "vite preview",
      test: "vitest",
    },
  };

  const baseDeps = {
    react: ["react", "react-dom", "react-scripts"],
    next: ["next", "react", "react-dom"],
    vue: ["vue", "@vitejs/plugin-vue", "vite"],
  };

  const baseDevDeps = {
    react: [
      "@testing-library/react",
      "@testing-library/jest-dom",
      "@types/react",
      "@types/react-dom",
    ],
    next: [
      "@types/node",
      "@types/react",
      "@types/react-dom",
      "eslint",
      "eslint-config-next",
      "typescript",
    ],
    vue: ["@types/node", "typescript", "vitest"],
  };

  const packageContent = {
    ...basePackage,
    scripts: scripts[framework],
    dependencies: [...baseDeps[framework], ...dependencies].reduce(
      (acc, dep) => {
        acc[dep] = "latest";
        return acc;
      },
      {} as Record<string, string>
    ),
    devDependencies: [...baseDevDeps[framework], ...devDependencies].reduce(
      (acc, dep) => {
        acc[dep] = "latest";
        return acc;
      },
      {} as Record<string, string>
    ),
  };

  return JSON.stringify(packageContent, null, 2);
}

/**
 * Calculate accessibility score based on features
 */
export function calculateAccessibilityScore(
  guidance: GuidanceResponse
): number {
  const { components, accessibility } = guidance;
  let score = 70; // Base score

  // Check for accessibility considerations
  if (accessibility && accessibility.length > 0) {
    score += Math.min(accessibility.length * 5, 20); // Up to 20 points for accessibility items
  }

  // Check for form components (require more accessibility)
  const hasFormComponents = components.some(
    (comp) =>
      comp.name.toLowerCase().includes("form") ||
      comp.name.toLowerCase().includes("input") ||
      comp.name.toLowerCase().includes("button")
  );

  if (hasFormComponents && accessibility.length < 2) {
    score -= 15; // Penalty for forms without accessibility considerations
  }

  // Check for complex components
  const complexComponents = components.filter((comp) => comp.complexity >= 4);
  if (complexComponents.length > 0 && accessibility.length === 0) {
    score -= 20; // Penalty for complex components without accessibility
  }

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Generate analysis metrics from guidance
 */
export function generateAnalysisMetrics(
  guidance: GuidanceResponse
): AnalysisMetrics {
  return {
    complexity: guidance.complexity,
    estimatedTime: estimateDevTime(guidance),
    componentCount: guidance.components.length,
    dependencyCount: guidance.dependencies?.length || 0,
    accessibilityScore: calculateAccessibilityScore(guidance),
  };
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Format timestamp for chat messages
 */
export function formatTimestamp(date: Date = new Date()): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return "Just now";
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  // Show date
  return date.toLocaleDateString();
}

/**
 * Storage utilities for chat history and snippets
 */
export const storage = {
  // Get item from localStorage with type safety
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  // Set item to localStorage
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },

  // Remove item from localStorage
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
    }
  },

  // Clear all items
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  },
};

/**
 * URL and route utilities
 */
export const urlUtils = {
  // Extract filename from URL
  getFilename(url: string): string {
    return url.split("/").pop() || "file";
  },

  // Check if URL is valid
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Get base URL
  getBaseUrl(): string {
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return "";
  },
};

/**
 * Error handling utilities
 */
export const errorUtils = {
  // Format error for display
  formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred";
  },

  // Check if error is network related
  isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.toLowerCase().includes("network") ||
        error.message.toLowerCase().includes("fetch") ||
        error.message.toLowerCase().includes("connection")
      );
    }
    return false;
  },
};

/**
 * Validation utilities
 */
export const validation = {
  // Email validation
  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Check if string is empty or whitespace
  isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  },

  // Validate component name
  isValidComponentName(name: string): boolean {
    const regex = /^[A-Z][a-zA-Z0-9]*$/;
    return regex.test(name);
  },
};
