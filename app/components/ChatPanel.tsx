"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Alert,
  Chip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  Image as ImageIcon,
  SmartToy as BotIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  ChevronRight,
  PlayArrow,
  Visibility,
} from "@mui/icons-material";
import { ChatSession, Message, SavedSnippet } from "@/lib/types";
import { apiClient, validateImageFile } from "@/lib/utils";
import MessageBubble from "./MessageBubble";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface ChatPanelProps {
  currentSession: ChatSession | null;
  onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
  onCodeSelect: (code: string, language: string) => void;
  copiedCodeId: string | null;
  onCopyCode: (code: string, codeId: string) => void;
}

export default function ChatPanel({
  currentSession,
  onAddMessage,
  onSaveSnippet,
  onCodeSelect,
  copiedCodeId, // ✅ Add this
  onCopyCode,
}: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [detectedFramework, setDetectedFramework] = useState<string | null>(
    null
  );
  const [processingStage, setProcessingStage] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateCodeId = () =>
    `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const determineRequestType = (userMessage: string, hasImage: boolean) => {
    const lowerMessage = userMessage.toLowerCase();

    if (hasImage) return "vision";

    const codeKeywords = [
      "give me",
      "create",
      "generate",
      "build",
      "make",
      "write code",
      "component",
      "function",
      "code for",
    ];
    const hasCodeKeyword = codeKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    const guidanceKeywords = [
      "how to",
      "guide",
      "tutorial",
      "explain",
      "learn",
      "teach me",
      "steps",
      "guidelines",
      "what is",
      "understand",
    ];
    const hasGuidanceKeyword = guidanceKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    if (hasCodeKeyword && !hasGuidanceKeyword) return "code";
    if (hasGuidanceKeyword) return "guidance";

    return "guidance";
  };

  const detectLanguageAndFramework = (
    userMessage: string
  ): { language: string; framework: string } => {
    const lower = userMessage.toLowerCase();

    // Language detection
    let language = "typescript"; // default
    let framework = "react"; // default

    // Check for explicit language mentions
    if (lower.includes("python") || lower.includes(".py")) {
      language = "python";
      framework = "none";
    } else if (lower.includes("java") && !lower.includes("javascript")) {
      language = "java";
      framework = "none";
    } else if (lower.includes("c++") || lower.includes("cpp")) {
      language = "cpp";
      framework = "none";
    } else if (lower.includes("c#") || lower.includes("csharp")) {
      language = "csharp";
      framework = "none";
    } else if (lower.includes("go") || lower.includes("golang")) {
      language = "go";
      framework = "none";
    } else if (lower.includes("rust")) {
      language = "rust";
      framework = "none";
    } else if (lower.includes("php")) {
      language = "php";
      framework = "none";
    } else if (lower.includes("ruby")) {
      language = "ruby";
      framework = "none";
    } else if (
      lower.includes("html") ||
      lower.includes("webpage") ||
      lower.includes("web page")
    ) {
      language = "html";
      framework = "none";
    } else if (lower.includes("css") || lower.includes("stylesheet")) {
      language = "css";
      framework = "none";
    } else if (lower.includes("javascript") || lower.includes(".js")) {
      language = "javascript";
    } else if (lower.includes("typescript") || lower.includes(".ts")) {
      language = "typescript";
    }

    // Framework detection (only if not already set to 'none')
    if (framework !== "none") {
      if (lower.includes("vue")) {
        framework = "vue";
        language = "javascript";
      } else if (lower.includes("angular")) {
        framework = "angular";
        language = "typescript";
      } else if (lower.includes("next") || lower.includes("nextjs")) {
        framework = "next";
        language = "typescript";
      } else if (lower.includes("svelte")) {
        framework = "svelte";
        language = "javascript";
      } else if (lower.includes("react")) {
        framework = "react";
      }
    }

    return { language, framework };
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !uploadedImage) return;

    const userMessage = message.trim();
    const hasImage = !!uploadedImage;
    const imageToAnalyze = uploadedImage; // Store reference before clearing
    const requestType = determineRequestType(userMessage, hasImage);

    setError(null);
    setIsLoading(true);

    try {
      const userMsg: Omit<Message, "id" | "timestamp"> = {
        type: "user",
        content: userMessage || "Analyze this image",
        image: imagePreview || undefined,
      };
      onAddMessage(userMsg);
      setMessage("");
      // Clear image preview immediately
      setUploadedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (requestType === "vision" && imageToAnalyze) {
        setProcessingStage("Analyzing image...");
        const visionResponse = await apiClient.analyzeImage(
          imageToAnalyze,
          userMessage
        );
        const visionMsg: Omit<Message, "id" | "timestamp"> = {
          type: "assistant",
          content: "",
          data: { type: "vision", response: visionResponse },
        };
        onAddMessage(visionMsg);
      } else if (requestType === "code") {
        setProcessingStage("Generating code...");
        // Smart detection of language and framework
        const { language, framework } = detectLanguageAndFramework(userMessage);
        setDetectedLanguage(language);
        setDetectedFramework(framework);
        const codeResponse = await apiClient.generateCode({
          prompt: userMessage,
          language: language, // ✅ Use detected language
          framework: framework, // ✅ Use detected framework
          includeTests: false,
          includeComments: true,
        });
        const codeMsg: Omit<Message, "id" | "timestamp"> = {
          type: "assistant",
          content: "",
          data: { type: "code", response: codeResponse },
        };
        onAddMessage(codeMsg);
        if (codeResponse.mainCode?.code) {
          onCodeSelect(
            codeResponse.mainCode.code,
            codeResponse.mainCode.language
          );
        }
      } else {
        setProcessingStage("Generating guidance...");
        const guidanceResponse = await apiClient.generateGuidance(userMessage);
        const guidanceMsg: Omit<Message, "id" | "timestamp"> = {
          type: "assistant",
          content: "",
          data: { type: "guidance", response: guidanceResponse },
        };
        onAddMessage(guidanceMsg);
        if (guidanceResponse.content?.completeExample?.code) {
          onCodeSelect(
            guidanceResponse.content.completeExample.code,
            "typescript"
          );
        }
      }
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage =
        "I encountered an error processing your request. Please try again.";
      setError(errorMessage);
      const errorMsg: Omit<Message, "id" | "timestamp"> = {
        type: "assistant",
        content: `❌ ${errorMessage}`,
      };
      onAddMessage(errorMsg);
    } finally {
      setIsLoading(false);
      setProcessingStage("");
      setUploadedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const CodeBlock = ({
    code,
    language = "typescript",
    showLineNumbers = true,
    filename,
    onRunCode,
  }: {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
    filename?: string;
    onRunCode?: (code: string, language: string) => void;
  }) => {
    const codeId = useRef(
      `code-${code.substring(0, 20)}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`
    ).current;
    const isCopied = copiedCodeId === codeId;

    return (
      <Box sx={{ position: "relative", mb: 2 }}>
        {(filename || onRunCode) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "grey.900",
              color: "white",
              px: 2,
              py: 1,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottom: "1px solid",
              borderColor: "grey.700",
            }}
          >
            <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
              {filename || `${language.toUpperCase()} Code`}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {onRunCode && (
                <Tooltip title="Run code in editor">
                  <IconButton
                    size="small"
                    onClick={() => onRunCode(code, language)}
                    sx={{ color: "white", "&:hover": { bgcolor: "grey.700" } }}
                  >
                    <PlayArrow fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        )}

        <SyntaxHighlighter
          language={language}
          customStyle={{
            borderRadius: filename || onRunCode ? "0 0 8px 8px" : 8,
            fontSize: "0.85em",
            margin: 0,
          }}
          showLineNumbers={showLineNumbers}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    );
  };

  const renderGuidanceResponse = (response: any) => {
    const content = response.content;
    return (
      <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
        <Card sx={{ mb: 2, bgcolor: "primary.50", border: "none" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <SchoolIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                {content.title || "Programming Guidance"}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {content.overview}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<ScheduleIcon />}
                label={`Time: ${content.estimatedTime || "Varies"}`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<PsychologyIcon />}
                label={`Level: ${content.difficulty || "All Levels"}`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<TrendingUpIcon />}
                label={content.category || "General"}
                size="small"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>

        {content.prerequisites?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">📋 Prerequisites</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {content.prerequisites.map((prereq: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={prereq} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {content.learningObjectives?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">🎯 What You'll Learn</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {content.learningObjectives.map(
                  (objective: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <LightbulbIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={objective} />
                    </ListItem>
                  )
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {content.stepByStepGuide?.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">🚀 Step-by-Step Guide</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {content.stepByStepGuide.map((step: any, index: number) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "start", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 32,
                            height: 32,
                          }}
                        >
                          {step.step}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {step.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {step.description}
                          </Typography>

                          {step.codeExample && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Code Example:
                              </Typography>
                              <CodeBlock
                                code={step.codeExample}
                                language="typescript"
                                onRunCode={onCodeSelect}
                              />
                            </Box>
                          )}

                          {step.tips?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                💡 Pro Tips:
                              </Typography>
                              <List dense>
                                {step.tips.map(
                                  (tip: string, tipIndex: number) => (
                                    <ListItem key={tipIndex}>
                                      <ListItemText primary={tip} />
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {content.completeExample?.code && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">🔥 Complete Example</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                {content.completeExample.description}
              </Typography>
              <CodeBlock
                code={content.completeExample.code}
                language="typescript"
                filename="CompleteExample.tsx"
                onRunCode={onCodeSelect}
              />
            </AccordionDetails>
          </Accordion>
        )}

        {content.bestPractices?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">✅ Best Practices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {content.bestPractices.map((practice: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={practice.practice || practice}
                      secondary={practice.reason || "Industry standard"}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {content.nextSteps?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">📚 Continue Learning</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {content.nextSteps.map((next: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ChevronRight color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={next.step || next}
                      secondary={next.reason || "Recommended next topic"}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  };

  const renderCodeResponse = (response: any) => {
    return (
      <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
        <Card sx={{ mb: 2, bgcolor: "success.50", border: "none" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <CodeIcon color="success" />
              <Typography variant="h6" fontWeight="bold">
                {response.title || "Generated Code"}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {response.description}
            </Typography>
            {response.overview && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Purpose:</strong> {response.overview.purpose}
                </Typography>
                <Typography variant="body2">
                  <strong>Complexity:</strong> {response.overview.complexity}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {response.mainCode && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CodeIcon color="primary" />
                <Typography fontWeight="bold">
                  Main Code ({response.mainCode.filename})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" paragraph>
                {response.mainCode.explanation}
              </Typography>
              <CodeBlock
                code={response.mainCode.code}
                language={response.mainCode.language || "typescript"}
                filename={response.mainCode.filename}
                onRunCode={onCodeSelect}
              />
            </AccordionDetails>
          </Accordion>
        )}

        {response.features?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">✨ Features</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {response.features.map((feature: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.feature || feature}
                      secondary={feature.description || feature.howItWorks}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {response.usage && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">📖 How to Use</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                {response.usage.description}
              </Typography>
              {response.usage.example && (
                <CodeBlock
                  code={response.usage.example}
                  language="typescript"
                />
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {response.dependencies?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">📦 Dependencies</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {response.dependencies.map((dep: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <BuildIcon color="action" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${dep.name} ${dep.version}`}
                      secondary={dep.purpose}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {response.bestPractices?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">✅ Best Practices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {response.bestPractices.map((practice: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={practice.practice}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {practice.why}
                          </Typography>
                          {practice.example && (
                            <CodeBlock
                              code={practice.example}
                              language="typescript"
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  };

  const renderVisionResponse = (response: any) => {
    return (
      <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
        <Card sx={{ mb: 2, bgcolor: "info.50", border: "none" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Visibility color="info" />
              <Typography variant="h6" fontWeight="bold">
                🎨 UI Analysis: {response.pageType}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {response.description}
            </Typography>
          </CardContent>
        </Card>

        {response.uiElements?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                📋 Identified Components
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {response.uiElements.map((element: string, index: number) => (
                  <Chip key={index} label={element} variant="outlined" />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {response.stepByStepGuide?.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">🚀 Implementation Steps</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {response.stepByStepGuide.map((step: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                      >
                        {step.step}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={step.title}
                      secondary={step.description}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  };

  const handleImageUpload = (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    setQuickMenuAnchor(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyCode = async (code: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      onCopyCode(code, codeId); // This triggers the "Copied!" state in parent
    } catch (err) {
      console.error("Failed to copy code:", err);
      setError("Failed to copy code to clipboard");
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: { xs: 1, md: 2 },
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.1)",
            borderRadius: "4px",
          },
        }}
      >
        {!currentSession?.messages.length && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              gap: 3,
              px: 2,
            }}
          >
            <BotIcon
              sx={{
                fontSize: { xs: 48, md: 64 },
                color: "primary.main",
                opacity: 0.7,
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // 👈 stack vertically
                alignItems: "center", // 👈 center horizontally
                width: "100%",
                textAlign: "center", // 👈 center text inside
              }}
            >
              <Typography
                variant="h4"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                AI Frontend Helper
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 500, mb: 3 }}
              >
                Get step-by-step coding guidance, generate production-ready
                components, or analyze UI designs with AI assistance.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              ></Box>
            </Box>
          </Box>
        )}

        {currentSession?.messages.map((msg, index) => (
          <Box key={msg.id}>
            {msg.type === "user" ? (
              <MessageBubble
                message={msg}
                onSaveSnippet={onSaveSnippet}
                onCodeSelect={onCodeSelect}
              />
            ) : (
              <Box sx={{ display: "flex", gap: 1, mb: 2, maxWidth: "100%" }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 32,
                    height: 32,
                    mt: 0.5,
                  }}
                >
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  sx={{
                    p: 2,
                    flex: 1,
                    maxWidth: "100%",
                    overflow: "hidden",
                    bgcolor: "grey.50",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  {msg.data ? (
                    <>
                      {msg.data.type === "guidance" &&
                        renderGuidanceResponse(msg.data.response)}
                      {msg.data.type === "code" &&
                        renderCodeResponse(msg.data.response)}
                      {msg.data.type === "vision" &&
                        renderVisionResponse(msg.data.response)}
                    </>
                  ) : (
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
          </Box>
        ))}

        {isLoading && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, mb: 2 }}
          >
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
              <BotIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "text.secondary",
                      animation: "typing 1.4s infinite",
                      animationDelay: "0s",
                      "@keyframes typing": {
                        "0%, 60%, 100%": { transform: "translateY(0)" },
                        "30%": { transform: "translateY(-4px)" },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "text.secondary",
                      animation: "typing 1.4s infinite",
                      animationDelay: "0.2s",
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "text.secondary",
                      animation: "typing 1.4s infinite",
                      animationDelay: "0.4s",
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {processingStage || "Processing..."}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {error && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {imagePreview && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 2,
            }}
          >
            <Box
              component="img"
              src={imagePreview}
              alt="Upload preview"
              sx={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {uploadedImage?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ready to analyze •{" "}
                {Math.round((uploadedImage?.size || 0) / 1024)} KB
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={removeImage}
              sx={{ color: "text.secondary" }}
            >
              ×
            </IconButton>
          </Paper>
        </Box>
      )}

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
            maxWidth: "100%",
          }}
        >
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <ImageIcon />
          </IconButton>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for coding guidance, generate components, or upload UI designs..."
            disabled={isLoading}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <IconButton
            onClick={handleSendMessage}
            disabled={(!message.trim() && !uploadedImage) || isLoading}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              "&:disabled": { bgcolor: "grey.300", color: "grey.500" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1, textAlign: "center" }}
        >
          Ask for guidance • Generate code • Upload images
        </Typography>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </Box>
  );
}
