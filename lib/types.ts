// // lib/types.ts
// export interface Message {
//   id: string;
//   type: "user" | "assistant";
//   content: string;
//   timestamp: Date;
//   image?: string;
//   guidance?: GuidanceResponse;
// }

// export interface GuidanceResponse {
//   pageType: string;
//   folderStructure: string[];
//   components: ComponentInfo[];
//   complexity: ComplexityInfo;
//   snippets: CodeSnippet[];
//   styling: StylingInfo;
//   accessibility: string[];
// }

// export interface ComponentInfo {
//   name: string;
//   count: number;
//   description: string;
//   props?: string[];
// }

// export interface ComplexityInfo {
//   level: "simple" | "medium" | "complex";
//   estimatedHours: number;
//   factors: string[];
// }

// export interface CodeSnippet {
//   id: string;
//   name: string;
//   framework: string;
//   code: string;
//   description?: string;
// }

// export interface StylingInfo {
//   muiProps: Record<string, any>;
//   tailwindAlternatives: string[];
//   responsive: Record<string, any>;
// }

// export interface VisionResponse {
//   success: boolean;
//   ocr: {
//     text: string;
//     confidence: number;
//   };
//   vision: {
//     description: string;
//     confidence: number;
//   };
//   merged: string;
//   error?: string;
// }

// export interface ChatSession {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: Date;
// }

// export interface SavedSnippet {
//   id: string;
//   name: string;
//   code: string;
//   framework: string;
//   savedAt: Date;
// }

// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

// lib/types.ts

// export interface Message {
//   id: string;
//   type: "user" | "assistant";
//   content: string;
//   timestamp: Date;
//   image?: string;
//   guidance?: GuidanceResponse;
// }

// export interface GuidanceResponse {
//   pageType: string;
//   folderStructure: string[];
//   components: ComponentInfo[];
//   complexity: ComplexityInfo;
//   snippets: CodeSnippet[];
//   styling: StylingInfo;
//   accessibility: string[];
// }

// export interface ComponentInfo {
//   name: string;
//   count: number;
//   description: string;
//   props?: string[];
// }

// export interface ComplexityInfo {
//   level: "simple" | "medium" | "complex";
//   estimatedHours: number;
//   factors: string[];
// }

// export interface CodeSnippet {
//   id: string;
//   name: string;
//   framework: string;
//   code: string;
//   description?: string;
// }

// export interface StylingInfo {
//   muiProps: Record<string, any>;
//   tailwindAlternatives: string[];
//   responsive: Record<string, any>;
// }

// export interface VisionResponse {
//   success: boolean;
//   ocr: {
//     text: string;
//     confidence: number;
//   };
//   vision: {
//     description: string;
//     confidence: number;
//   };
//   merged: string;
//   error?: string;
// }

// // Extended Vision Response with additional fields
// export interface VisionAnalysisResponse extends VisionResponse {
//   pageType?: string;
//   uiElements?: string[];
//   folderStructure?: string[];
//   filesList?: Array<{
//     path: string;
//     purpose: string;
//   }>;
//   recommendedTech?: {
//     frontend?: string[];
//     styling?: string[];
//     stateManagement?: string[];
//     backend?: string[];
//     database?: string[];
//   };
//   stepByStepGuide?: Array<{
//     step: number;
//     title: string;
//     description: string;
//     commands?: string[];
//     details?: string;
//   }>;
//   components?: Array<{
//     name: string;
//     purpose: string;
//     props?: string[];
//     complexity?: string;
//   }>;
//   colorPalette?: {
//     primary?: string;
//     secondary?: string;
//     background?: string;
//     text?: string;
//   };
//   designPatterns?: string[];
//   accessibility?: string[];
//   responsiveBreakpoints?: {
//     mobile?: string;
//     tablet?: string;
//     desktop?: string;
//   };
// }

// // Code Generation Response
// export interface CodeGenerationResponse {
//   title: string;
//   description: string;
//   mainCode: {
//     filename: string;
//     language: string;
//     code: string;
//     explanation: string;
//   };
//   additionalFiles?: Array<{
//     filename: string;
//     language: string;
//     code: string;
//     purpose: string;
//   }>;
//   styling?: {
//     filename: string;
//     code: string;
//     approach: string;
//   };
//   dependencies: Array<{
//     name: string;
//     version: string;
//     purpose: string;
//   }>;
//   installation?: {
//     commands: string[];
//     notes?: string;
//   };
//   usage: {
//     description: string;
//     example?: string;
//   };
//   features: string[];
//   props?: Array<{
//     name: string;
//     type: string;
//     required: boolean;
//     description: string;
//   }>;
//   tests?: {
//     filename: string;
//     code: string;
//     framework: string;
//   };
//   bestPractices: string[];
//   accessibility?: string[];
//   performance?: string[];
//   alternatives?: Array<{
//     title: string;
//     description: string;
//   }>;
//   metadata?: {
//     generatedAt: string;
//     language: string;
//     framework: string;
//     includeTests: boolean;
//     includeComments: boolean;
//     fallback?: boolean;
//   };
// }

// // Guidance/Tutorial Response
// export interface GuidanceTutorialResponse {
//   type: string;
//   content: {
//     title: string;
//     overview: string;
//     difficulty?: string;
//     estimatedTime?: string;
//     prerequisites?: string[];
//     stepByStepGuide: Array<{
//       step: number;
//       title: string;
//       description: string;
//       codeExample?: string;
//       explanation?: string;
//       tips?: string[];
//     }>;
//     completeExample?: {
//       title?: string;
//       code: string;
//       explanation: string;
//     };
//     bestPractices?: string[];
//     commonPitfalls?: Array<{
//       issue: string;
//       solution: string;
//     }>;
//     testing?: {
//       description: string;
//       examples: string[];
//     };
//     resources?: Array<{
//       title: string;
//       url?: string;
//       description: string;
//     }>;
//     nextSteps?: string[];
//     relatedTopics?: string[];
//   };
//   rawResponse?: string;
// }

// export interface ChatSession {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: Date;
// }

// export interface SavedSnippet {
//   id: string;
//   name: string;
//   code: string;
//   framework: string;
//   savedAt: Date;
// }

// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

// // Request Types
// export interface CodeGenerationRequest {
//   prompt: string;
//   language?: string;
//   framework?: string;
//   includeTests?: boolean;
//   includeComments?: boolean;
// }

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string;
  data?: {
    type: "guidance" | "code" | "vision";
    response:
      | GuidanceTutorialResponse
      | CodeGenerationResponse
      | VisionAnalysisResponse;
  };
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
  success: boolean;
  ocr: {
    text: string;
    confidence: number;
  };
  vision: {
    description: string;
    confidence: number;
  };
  merged: string;
  error?: string;
}

// Extended Vision Response with additional fields
export interface VisionAnalysisResponse extends VisionResponse {
  pageType?: string;
  uiElements?: string[];
  folderStructure?: string[];
  filesList?: Array<{
    path: string;
    purpose: string;
  }>;
  recommendedTech?: {
    frontend?: string[];
    styling?: string[];
    stateManagement?: string[];
    backend?: string[];
    database?: string[];
  };
  stepByStepGuide?: Array<{
    step: number;
    title: string;
    description: string;
    commands?: string[];
    details?: string;
  }>;
  components?: Array<{
    name: string;
    purpose: string;
    props?: string[];
    complexity?: string;
  }>;
  colorPalette?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  designPatterns?: string[];
  accessibility?: string[];
  responsiveBreakpoints?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

// Code Generation Response
export interface CodeGenerationResponse {
  title: string;
  description: string;
  overview?: {
    purpose: string;
    approach: string;
    complexity: string;
    learningValue: string;
  };
  mainCode: {
    filename: string;
    language: string;
    code: string;
    explanation: string;
    lineByLineExplanation?: Array<{
      lines: string;
      code: string;
      what: string;
      why: string;
      analogy: string;
    }>;
    keyConceptsUsed?: Array<{
      concept: string;
      explanation: string;
      analogy: string;
      moreInfo: string;
    }>;
  };
  codeBreakdown?: {
    sections: Array<{
      title: string;
      purpose: string;
      explanation: string;
      analogy: string;
    }>;
  };
  additionalFiles?: Array<{
    filename: string;
    language: string;
    code: string;
    purpose: string;
  }>;
  styling?: {
    filename: string;
    code: string;
    approach: string;
    explanation: string;
    keyConcepts?: Array<{
      concept: string;
      why: string;
      analogy: string;
    }>;
  };
  dependencies: Array<{
    name: string;
    version: string;
    purpose: string;
    whatItDoes?: string;
    alternatives?: string;
  }>;
  installation?: {
    commands: string[];
    notes?: string;
    explanation?: string;
  };
  usage: {
    description: string;
    example?: string;
    explanation?: string;
    commonScenarios?: Array<{
      scenario: string;
      implementation: string;
    }>;
  };
  features:
    | Array<{
        feature: string;
        description: string;
        codeLocation?: string;
        howItWorks?: string;
      }>
    | string[];
  props?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
    validation?: string;
  }>;
  tests?: {
    filename: string;
    code: string;
    framework: string;
    explanation?: string;
    testCases?: Array<{
      test: string;
      why: string;
      whatItChecks: string;
    }>;
  };
  bestPractices:
    | Array<{
        practice: string;
        why: string;
        example: string;
        wrongWay?: string;
        impact?: string;
      }>
    | string[];
  accessibility?: Array<{
    practice: string;
    implementation: string;
    why: string;
    testing?: string;
  }>;
  performance?: Array<{
    optimization: string;
    implementation: string;
    impact: string;
    tradeoffs?: string;
  }>;
  commonMistakes?: Array<{
    mistake: string;
    why: string;
    correct: string;
    howToAvoid: string;
  }>;
  troubleshooting?: Array<{
    issue: string;
    symptoms: string;
    cause: string;
    solution: string;
    prevention: string;
  }>;
  realWorldAnalogies?: Array<{
    codeConcept: string;
    analogy: string;
    explanation: string;
  }>;
  extendingThisCode?: Array<{
    enhancement: string;
    difficulty: string;
    steps: string;
    learningValue: string;
  }>;
  alternatives?: Array<{
    approach: string;
    when: string;
    tradeoffs: string;
    example?: string;
  }>;
  deepDive?: {
    advancedConcepts?: Array<{
      concept: string;
      explanation: string;
      resources: string;
    }>;
    underTheHood?: string;
    browserBehavior?: string;
  };
  learningPath?: {
    prerequisites?: string;
    nextSteps?: string;
    relatedConcepts?: string;
  };
  metadata?: {
    generatedAt: string;
    language: string;
    framework: string;
    includeTests: boolean;
    includeComments: boolean;
    fallback?: boolean;
  };
}

// Guidance/Tutorial Response
export interface GuidanceTutorialResponse {
  type: string;
  content: {
    title: string;
    overview: string;
    category?: string;
    difficulty?: string;
    estimatedTime?: string;
    prerequisites?: string[];
    learningObjectives?: string[];
    stepByStepGuide: Array<{
      step: number;
      title: string;
      description: string;
      codeExample?: string;
      explanation?: string;
      realWorldAnalogy?: string;
      tips?: string[];
      keyPoints?: string[];
      commonErrors?: Array<{
        error: string;
        why: string;
        fix: string;
      }>;
    }>;
    completeExample?: {
      title?: string;
      description?: string;
      code: string;
      explanation?: string;
      liveDemo?: string;
      realWorldUse?: string;
    };
    careerPath?: {
      applicable: boolean;
      roles?: string[];
      skillLevel?: string;
      salaryRange?: string;
      demandLevel?: string;
      companies?: string[];
    };
    visualExplanations?: Array<{
      concept: string;
      description: string;
      analogy: string;
    }>;
    bestPractices?:
      | Array<{
          practice: string;
          reason: string;
          example?: string;
          impact?: string;
        }>
      | string[];
    commonPitfalls?: Array<{
      issue: string;
      why: string;
      solution: string;
      example?: string;
    }>;
    advancedTips?: Array<{
      tip: string;
      when: string;
      example?: string;
    }>;
    testing?: {
      description?: string;
      strategies?: string[];
      exercises?: Array<{
        challenge: string;
        hint: string;
        solution: string;
      }>;
    };
    troubleshooting?: Array<{
      problem: string;
      symptoms: string;
      diagnosis: string;
      solution: string;
      prevention: string;
    }>;
    realWorldApplications?: Array<{
      application: string;
      example: string;
      implementation: string;
      scale: string;
    }>;
    interviewQuestions?: Array<{
      question: string;
      answer: string;
      followUp: string;
    }>;
    resources?: Array<{
      title: string;
      url?: string;
      description: string;
      type?: string;
      difficulty?: string;
      duration?: string;
    }>;
    milestones?: Array<{
      milestone: string;
      timeframe: string;
      validation: string;
      celebration: string;
    }>;
    nextSteps?: Array<{
      step: string;
      reason: string;
      resources: string[];
    }>;
    relatedTopics?: Array<{
      topic: string;
      relationship: string;
      priority: string;
    }>;
    practiceProjects?: Array<{
      title: string;
      description: string;
      difficulty: string;
      timeEstimate: string;
      skills: string[];
      features: string[];
      bonus?: string;
      portfolio?: string;
    }>;
    motivation?: {
      whyLearnThis?: string;
      marketDemand?: string;
      success?: string;
    };
  };
  generatedAt?: string;
  query?: string;
  rawResponse?: string;
  parseError?: boolean;
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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Request Types
export interface CodeGenerationRequest {
  prompt: string;
  language?: string;
  framework?: string;
  includeTests?: boolean;
  includeComments?: boolean;
}
