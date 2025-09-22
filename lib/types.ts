export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string;
  guidance?: GuidanceResponse;
}

export interface GuidanceResponse {
  pageType: string;
  folderStructure: string[];
  components: ComponentInfo[];
  complexity: ComplexityInfo;
  snippets: CodeSnippet[];
  styling: StylingInfo;
  accessibility: string[];
}

export interface ComponentInfo {
  name: string;
  count: number;
  description: string;
  props?: string[];
}

export interface ComplexityInfo {
  level: "simple" | "medium" | "complex";
  estimatedHours: number;
  factors: string[];
}

export interface CodeSnippet {
  id: string;
  name: string;
  framework: string;
  code: string;
  description?: string;
}

export interface StylingInfo {
  muiProps: Record<string, any>;
  tailwindAlternatives: string[];
  responsive: Record<string, any>;
}

export interface VisionResponse {
  text: string;
  ocr: string;
  vision: string;
  confidence: {
    ocr: number;
    vision: number;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface SavedSnippet {
  id: string;
  name: string;
  code: string;
  framework: string;
  savedAt: Date;
}
