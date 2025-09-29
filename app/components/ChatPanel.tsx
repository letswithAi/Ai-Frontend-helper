// // // "use client";

// // // import React, { useState, useRef, useEffect } from "react";
// // // import {
// // //   Box,
// // //   TextField,
// // //   IconButton,
// // //   Button,
// // //   Typography,
// // //   Paper,
// // //   Avatar,
// // //   Menu,
// // //   MenuItem,
// // //   CircularProgress,
// // //   Alert,
// // // } from "@mui/material";
// // // import {
// // //   Send as SendIcon,
// // //   Image as ImageIcon,
// // //   SmartToy as BotIcon,
// // //   ExpandMore as ExpandMoreIcon,
// // // } from "@mui/icons-material";
// // // import {
// // //   ChatSession,
// // //   Message,
// // //   SavedSnippet,
// // //   GuidanceResponse,
// // // } from "@/lib/types";
// // // import { apiClient, generateId, formatDate } from "@/lib/utils";
// // // import MessageBubble from "./MessageBubble";

// // // interface ChatPanelProps {
// // //   currentSession: ChatSession | null;
// // //   onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
// // //   onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
// // //   onCodeSelect: (code: string, language: string) => void;
// // // }

// // // const quickPrompts = [
// // //   "Analyze this landing page design",
// // //   "Break down this dashboard layout",
// // //   "Suggest components for this form",
// // //   "Convert to mobile-first design",
// // //   "Generate folder structure",
// // // ];

// // // export default function ChatPanel({
// // //   currentSession,
// // //   onAddMessage,
// // //   onSaveSnippet,
// // //   onCodeSelect,
// // // }: ChatPanelProps) {
// // //   const [message, setMessage] = useState("");
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
// // //   const [imagePreview, setImagePreview] = useState<string | null>(null);
// // //   const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
// // //     null
// // //   );

// // //   const messagesEndRef = useRef<HTMLDivElement>(null);
// // //   const fileInputRef = useRef<HTMLInputElement>(null);

// // //   const scrollToBottom = () => {
// // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   };

// // //   useEffect(() => {
// // //     scrollToBottom();
// // //   }, [currentSession?.messages]);

// // //   const handleSendMessage = async () => {
// // //     if (!message.trim() && !uploadedImage) return;

// // //     let processedMessage = message.trim();
// // //     let guidance: GuidanceResponse | undefined;

// // //     // Add user message
// // //     const userMessage: Omit<Message, "id" | "timestamp"> = {
// // //       type: "user",
// // //       content: processedMessage,
// // //       image: imagePreview || undefined,
// // //     };

// // //     onAddMessage(userMessage);
// // //     setMessage("");
// // //     setUploadedImage(null);
// // //     setImagePreview(null);
// // //     setIsLoading(true);
// // //     setError(null);

// // //     try {
// // //       // Step 1: Analyze image if provided
// // //       if (uploadedImage) {
// // //         const visionResponse = await apiClient.analyzeImage(uploadedImage);
// // //         processedMessage = visionResponse.text;

// // //         // Add a status message showing what was detected
// // //         const analysisMessage: Omit<Message, "id" | "timestamp"> = {
// // //           type: "assistant",
// // //           content: `**Image Analysis Complete!**\n\n${visionResponse.text}\n\nLet me break this down into actionable components...`,
// // //         };
// // //         onAddMessage(analysisMessage);
// // //       }

// // //       // Step 2: Generate development guidance
// // //       if (processedMessage) {
// // //         guidance = await apiClient.generateGuidance(
// // //           processedMessage,
// // //           "next", // default framework
// // //           "medium", // default complexity
// // //           { includeAccessibility: true }
// // //         );

// // //         const guidanceMessage: Omit<Message, "id" | "timestamp"> = {
// // //           type: "assistant",
// // //           content: generateGuidanceMessage(guidance),
// // //           guidance,
// // //         };

// // //         onAddMessage(guidanceMessage);
// // //       } else {
// // //         // No meaningful content to process
// // //         const helpMessage: Omit<Message, "id" | "timestamp"> = {
// // //           type: "assistant",
// // //           content: `I need more information to help you. Please either:

// // // 1. **Upload an image** - I can analyze UI designs, mockups, or screenshots
// // // 2. **Describe your requirements** - Tell me what kind of interface you want to build
// // // 3. **Ask specific questions** - About React components, styling, or implementation

// // // I'm here to help with frontend development guidance!`,
// // //         };

// // //         onAddMessage(helpMessage);
// // //       }
// // //     } catch (err) {
// // //       console.error("API Error:", err);

// // //       let errorMessage =
// // //         "Sorry, I encountered an error while processing your request.";

// // //       if (err instanceof Error) {
// // //         if (err.message.includes("Rate limit")) {
// // //           errorMessage =
// // //             "I'm receiving too many requests right now. Please wait a moment and try again.";
// // //         } else if (err.message.includes("API")) {
// // //           errorMessage =
// // //             "There's an issue with the AI service. Please try again in a few moments.";
// // //         } else {
// // //           errorMessage = `Error: ${err.message}`;
// // //         }
// // //       }

// // //       setError(errorMessage);

// // //       // Add error message to chat
// // //       const errorMsg: Omit<Message, "id" | "timestamp"> = {
// // //         type: "assistant",
// // //         content: errorMessage,
// // //       };
// // //       onAddMessage(errorMsg);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const generateGuidanceMessage = (guidance: GuidanceResponse): string => {
// // //     return `## ${guidance.pageType} Implementation Guide

// // // **📊 Complexity Analysis:**
// // // - Level: ${guidance.complexity.level}
// // // - Estimated Time: ${guidance.complexity.estimatedHours} hours
// // // - Key Factors: ${guidance.complexity.factors.join(", ")}

// // // **🧩 Components Identified:**
// // // ${guidance.components
// // //   .map((comp) => `- **${comp.name}** (${comp.count}x): ${comp.description}`)
// // //   .join("\n")}

// // // **📁 Recommended Structure:**
// // // \`\`\`
// // // ${guidance.folderStructure.join("\n")}
// // // \`\`\`

// // // **♿ Accessibility Checklist:**
// // // ${guidance.accessibility.map((item) => `- ${item}`).join("\n")}

// // // Click on any code snippet below to view and edit it in the code panel!`;
// // //   };

// // //   const handleImageUpload = (file: File) => {
// // //     setUploadedImage(file);

// // //     // Create preview
// // //     const reader = new FileReader();
// // //     reader.onload = (e) => {
// // //       setImagePreview(e.target?.result as string);
// // //     };
// // //     reader.readAsDataURL(file);
// // //   };

// // //   const handleQuickPrompt = (prompt: string) => {
// // //     setMessage(prompt);
// // //     setQuickMenuAnchor(null);
// // //   };

// // //   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = e.target.files?.[0];
// // //     if (file) {
// // //       // Validate file
// // //       const maxSize = 10 * 1024 * 1024; // 10MB
// // //       const allowedTypes = [
// // //         "image/png",
// // //         "image/jpeg",
// // //         "image/jpg",
// // //         "image/webp",
// // //       ];

// // //       if (!allowedTypes.includes(file.type)) {
// // //         setError(
// // //           `Invalid file type. Please upload: ${allowedTypes
// // //             .map((t) => t.split("/")[1])
// // //             .join(", ")}`
// // //         );
// // //         return;
// // //       }

// // //       if (file.size > maxSize) {
// // //         setError("File too large. Maximum size is 10MB.");
// // //         return;
// // //       }

// // //       handleImageUpload(file);
// // //     }
// // //   };

// // //   return (
// // //     <Box
// // //       sx={{
// // //         height: "100%",
// // //         display: "flex",
// // //         flexDirection: "column",
// // //         backgroundColor: "background.default",
// // //       }}
// // //     >
// // //       {/* Messages Area */}
// // //       <Box
// // //         sx={{
// // //           flex: 1,
// // //           overflow: "auto",
// // //           p: 2,
// // //         }}
// // //         className="chat-scrollbar"
// // //       >
// // //         {!currentSession?.messages.length && (
// // //           <Box
// // //             sx={{
// // //               display: "flex",
// // //               flexDirection: "column",
// // //               alignItems: "center",
// // //               justifyContent: "center",
// // //               height: "100%",
// // //               textAlign: "center",
// // //               gap: 2,
// // //             }}
// // //           >
// // //             <BotIcon
// // //               sx={{ fontSize: 64, color: "primary.main", opacity: 0.5 }}
// // //             />
// // //             <Typography variant="h5" color="text.secondary" gutterBottom>
// // //               AI Frontend Helper
// // //             </Typography>
// // //             <Typography
// // //               variant="body1"
// // //               color="text.secondary"
// // //               sx={{ maxWidth: 400 }}
// // //             >
// // //               Upload a UI design or describe what you want to build. I'll
// // //               provide detailed component breakdowns and implementation guidance.
// // //             </Typography>
// // //           </Box>
// // //         )}

// // //         {currentSession?.messages.map((msg) => (
// // //           <MessageBubble
// // //             key={msg.id}
// // //             message={msg}
// // //             onSaveSnippet={onSaveSnippet}
// // //             onCodeSelect={onCodeSelect}
// // //           />
// // //         ))}

// // //         {isLoading && (
// // //           <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
// // //             <Avatar sx={{ bgcolor: "secondary.main" }}>
// // //               <BotIcon />
// // //             </Avatar>
// // //             <Paper sx={{ p: 2, flex: 1 }}>
// // //               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// // //                 <CircularProgress size={16} />
// // //                 <Typography variant="body2" color="text.secondary">
// // //                   {uploadedImage
// // //                     ? "Analyzing image..."
// // //                     : "Generating guidance..."}
// // //                 </Typography>
// // //               </Box>
// // //             </Paper>
// // //           </Box>
// // //         )}

// // //         {error && (
// // //           <Alert severity="error" sx={{ my: 2 }} onClose={() => setError(null)}>
// // //             {error}
// // //           </Alert>
// // //         )}

// // //         <div ref={messagesEndRef} />
// // //       </Box>

// // //       {/* Input Area */}
// // //       <Paper
// // //         elevation={3}
// // //         sx={{
// // //           p: 2,
// // //           backgroundColor: "background.paper",
// // //           borderTop: 1,
// // //           borderColor: "divider",
// // //         }}
// // //       >
// // //         {imagePreview && (
// // //           <Box sx={{ mb: 2 }}>
// // //             <Paper sx={{ p: 1, display: "inline-block" }}>
// // //               <img
// // //                 src={imagePreview}
// // //                 alt="Uploaded"
// // //                 style={{
// // //                   maxHeight: 100,
// // //                   maxWidth: 200,
// // //                   borderRadius: 4,
// // //                 }}
// // //               />
// // //               <IconButton
// // //                 size="small"
// // //                 onClick={() => {
// // //                   setUploadedImage(null);
// // //                   setImagePreview(null);
// // //                 }}
// // //                 sx={{ ml: 1 }}
// // //               >
// // //                 ×
// // //               </IconButton>
// // //             </Paper>
// // //           </Box>
// // //         )}

// // //         <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
// // //           <TextField
// // //             fullWidth
// // //             multiline
// // //             maxRows={3}
// // //             value={message}
// // //             onChange={(e) => setMessage(e.target.value)}
// // //             placeholder="Describe your UI, upload an image, or ask for help..."
// // //             onKeyDown={(e) => {
// // //               if (e.key === "Enter" && !e.shiftKey) {
// // //                 e.preventDefault();
// // //                 handleSendMessage();
// // //               }
// // //             }}
// // //             disabled={isLoading}
// // //           />

// // //           <input
// // //             type="file"
// // //             ref={fileInputRef}
// // //             style={{ display: "none" }}
// // //             accept="image/*"
// // //             onChange={handleFileSelect}
// // //           />

// // //           <IconButton
// // //             onClick={() => fileInputRef.current?.click()}
// // //             disabled={isLoading}
// // //             color="primary"
// // //           >
// // //             <ImageIcon />
// // //           </IconButton>

// // //           <Button
// // //             variant="text"
// // //             endIcon={<ExpandMoreIcon />}
// // //             onClick={(e) => setQuickMenuAnchor(e.currentTarget)}
// // //             disabled={isLoading}
// // //             sx={{ minWidth: "auto", px: 1 }}
// // //           >
// // //             Quick
// // //           </Button>

// // //           <IconButton
// // //             onClick={handleSendMessage}
// // //             disabled={isLoading || (!message.trim() && !uploadedImage)}
// // //             color="primary"
// // //             sx={{
// // //               bgcolor: "primary.main",
// // //               color: "white",
// // //               "&:hover": { bgcolor: "primary.dark" },
// // //               "&:disabled": { bgcolor: "action.disabled" },
// // //             }}
// // //           >
// // //             <SendIcon />
// // //           </IconButton>
// // //         </Box>

// // //         <Menu
// // //           anchorEl={quickMenuAnchor}
// // //           open={Boolean(quickMenuAnchor)}
// // //           onClose={() => setQuickMenuAnchor(null)}
// // //         >
// // //           {quickPrompts.map((prompt) => (
// // //             <MenuItem key={prompt} onClick={() => handleQuickPrompt(prompt)}>
// // //               {prompt}
// // //             </MenuItem>
// // //           ))}
// // //         </Menu>
// // //       </Paper>
// // //     </Box>
// // //   );
// // // }

// // "use client";

// // import React, { useState, useRef, useEffect } from "react";
// // import {
// //   Box,
// //   TextField,
// //   IconButton,
// //   Button,
// //   Typography,
// //   Paper,
// //   Avatar,
// //   Menu,
// //   MenuItem,
// //   CircularProgress,
// //   Alert,
// //   Chip,
// // } from "@mui/material";
// // import {
// //   Send as SendIcon,
// //   Image as ImageIcon,
// //   SmartToy as BotIcon,
// //   ExpandMore as ExpandMoreIcon,
// //   Person as PersonIcon,
// // } from "@mui/icons-material";
// // import {
// //   ChatSession,
// //   Message,
// //   SavedSnippet,
// //   GuidanceResponse,
// // } from "@/lib/types";
// // import {
// //   apiClient,
// //   generateId,
// //   formatDate,
// //   validateImageFile,
// // } from "@/lib/utils";
// // import MessageBubble from "./MessageBubble";

// // interface ChatPanelProps {
// //   currentSession: ChatSession | null;
// //   onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
// //   onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
// //   onCodeSelect: (code: string, language: string) => void;
// // }

// // const quickPrompts = [
// //   "Analyze this login form design",
// //   "Break down this dashboard layout",
// //   "Suggest components for this landing page",
// //   "Convert this to mobile-first design",
// //   "Generate folder structure for this UI",
// //   "Create accessibility guidelines",
// // ];

// // export default function ChatPanel({
// //   currentSession,
// //   onAddMessage,
// //   onSaveSnippet,
// //   onCodeSelect,
// // }: ChatPanelProps) {
// //   const [message, setMessage] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
// //   const [imagePreview, setImagePreview] = useState<string | null>(null);
// //   const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
// //     null
// //   );
// //   const [processingStage, setProcessingStage] = useState<string>("");

// //   const messagesEndRef = useRef<HTMLDivElement>(null);
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [currentSession?.messages]);

// //   const handleSendMessage = async () => {
// //     if (!message.trim() && !uploadedImage) return;

// //     let processedMessage = message.trim();
// //     let guidance: GuidanceResponse | undefined;

// //     setError(null);
// //     setIsLoading(true);
// //     setProcessingStage("Processing...");

// //     try {
// //       // Add user message
// //       const userMessage: Omit<Message, "id" | "timestamp"> = {
// //         type: "user",
// //         content: processedMessage || "Analyze this uploaded image",
// //         image: imagePreview || undefined,
// //       };

// //       onAddMessage(userMessage);
// //       setMessage("");

// //       // Step 1: Analyze image if provided
// //       if (uploadedImage) {
// //         setProcessingStage("Analyzing image...");

// //         try {
// //           const visionResponse = await apiClient.analyzeImage(uploadedImage);
// //           processedMessage = visionResponse.text;

// //           // Add analysis status message
// //           const analysisMessage: Omit<Message, "id" | "timestamp"> = {
// //             type: "assistant",
// //             content: `**Image Analysis Complete!** 📸\n\n${visionResponse.text}\n\n*Now generating detailed development guidance...*`,
// //           };
// //           onAddMessage(analysisMessage);
// //         } catch (visionError) {
// //           console.warn("Image analysis failed:", visionError);
// //           processedMessage =
// //             processedMessage ||
// //             "Please analyze this UI design and provide development guidance.";
// //         }
// //       }

// //       // Step 2: Generate development guidance
// //       if (processedMessage) {
// //         setProcessingStage("Generating guidance...");

// //         try {
// //           guidance = await apiClient.generateGuidance(
// //             processedMessage,
// //             "next", // default framework
// //             "medium", // default complexity
// //             { includeAccessibility: true }
// //           );

// //           const guidanceMessage: Omit<Message, "id" | "timestamp"> = {
// //             type: "assistant",
// //             content: generateGuidanceMessage(guidance),
// //             guidance,
// //           };

// //           onAddMessage(guidanceMessage);

// //           // Auto-select first code snippet in preview
// //           if (guidance.snippets.length > 0) {
// //             const firstSnippet = guidance.snippets[0];
// //             onCodeSelect(firstSnippet.code, "typescript");
// //           }
// //         } catch (guidanceError) {
// //           console.error("Guidance generation failed:", guidanceError);

// //           const errorMessage: Omit<Message, "id" | "timestamp"> = {
// //             type: "assistant",
// //             content: `I apologize, but I encountered an issue generating detailed guidance. However, I can still help you!

// // Based on your ${
// //               uploadedImage ? "uploaded image" : "description"
// //             }, here are some general recommendations:

// // 🎯 **Getting Started:**
// // - Break down the UI into reusable components
// // - Use Material-UI for consistent styling
// // - Implement responsive design patterns
// // - Add proper TypeScript interfaces

// // 💡 **Next Steps:**
// // - Try rephrasing your request
// // - Upload a clearer image if applicable
// // - Ask specific questions about components or styling

// // I'm here to help with any specific questions about your frontend development!`,
// //           };
// //           onAddMessage(errorMessage);
// //         }
// //       } else {
// //         // No meaningful content to process
// //         const helpMessage: Omit<Message, "id" | "timestamp"> = {
// //           type: "assistant",
// //           content: `I'm ready to help you build amazing user interfaces! 🚀

// // **Here's what I can do:**

// // 📱 **Analyze UI Designs** - Upload screenshots, mockups, or wireframes
// // 🔍 **Component Breakdown** - Get detailed component lists and structures
// // 💻 **Generate Code** - Create React/Next.js components with TypeScript
// // 🎨 **Styling Guidance** - Material-UI props and Tailwind alternatives
// // ♿ **Accessibility** - WCAG compliance recommendations

// // **To get started:**
// // 1. Upload an image of your UI design, OR
// // 2. Describe what you want to build, OR
// // 3. Choose a quick prompt from the menu

// // What would you like to build today?`,
// //         };

// //         onAddMessage(helpMessage);
// //       }
// //     } catch (err) {
// //       console.error("API Error:", err);

// //       let errorMessage =
// //         "I encountered an error while processing your request. ";

// //       if (err instanceof Error) {
// //         if (err.message.includes("Rate limit")) {
// //           errorMessage +=
// //             "I'm receiving too many requests right now. Please wait a moment and try again.";
// //         } else if (err.message.includes("API")) {
// //           errorMessage +=
// //             "There's an issue with the AI service. Please try again in a few moments.";
// //         } else if (err.message.includes("network")) {
// //           errorMessage +=
// //             "Please check your internet connection and try again.";
// //         } else {
// //           errorMessage += "Please try again or rephrase your request.";
// //         }
// //       }

// //       setError(errorMessage);

// //       const errorMsg: Omit<Message, "id" | "timestamp"> = {
// //         type: "assistant",
// //         content: `❌ ${errorMessage}

// // **Troubleshooting tips:**
// // - Ensure your image is under 10MB and in PNG/JPG format
// // - Try describing your UI in text instead
// // - Check your internet connection
// // - Refresh the page if issues persist

// // I'm still here to help once the issue is resolved!`,
// //       };
// //       onAddMessage(errorMsg);
// //     } finally {
// //       setIsLoading(false);
// //       setProcessingStage("");
// //       setUploadedImage(null);
// //       setImagePreview(null);

// //       // Clear file input
// //       if (fileInputRef.current) {
// //         fileInputRef.current.value = "";
// //       }
// //     }
// //   };

// //   const generateGuidanceMessage = (guidance: GuidanceResponse): string => {
// //     return `## 🎯 ${guidance.pageType} Development Guide

// // ### 📊 **Project Analysis**
// // **Complexity:** ${guidance.complexity.level} • **Estimated Time:** ${
// //       guidance.complexity.estimatedHours
// //     } hours

// // **Key Factors:** ${guidance.complexity.factors.join(" • ")}

// // ### 🧩 **Component Breakdown** (${guidance.components.length} components)
// // ${guidance.components
// //   .map((comp) => `**${comp.name}** (${comp.count}x) - ${comp.description}`)
// //   .join("\n")}

// // ### 📁 **Recommended Structure**
// // \`\`\`
// // ${guidance.folderStructure.join("\n")}
// // \`\`\`

// // ### 🎨 **Styling Guidelines**
// // **Responsive Breakpoints:** xs=${guidance.styling.responsive.xs} • md=${
// //       guidance.styling.responsive.md
// //     } • lg=${guidance.styling.responsive.lg || 4}

// // **Tailwind Classes:** ${guidance.styling.tailwindAlternatives
// //       .slice(0, 6)
// //       .join(" • ")}

// // ### ♿ **Accessibility Checklist**
// // ${guidance.accessibility.map((item) => `✅ ${item}`).join("\n")}

// // ---
// // **💻 Code snippets are ready!** Click any snippet below to view it in the code editor, or check the preview panel on the right.`;
// //   };

// //   const handleImageUpload = (file: File) => {
// //     const validationError = validateImageFile(file);
// //     if (validationError) {
// //       setError(validationError);
// //       return;
// //     }

// //     setUploadedImage(file);

// //     // Create preview
// //     const reader = new FileReader();
// //     reader.onload = (e) => {
// //       setImagePreview(e.target?.result as string);
// //     };
// //     reader.readAsDataURL(file);

// //     setError(null);
// //   };

// //   const handleQuickPrompt = (prompt: string) => {
// //     setMessage(prompt);
// //     setQuickMenuAnchor(null);
// //   };

// //   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       handleImageUpload(file);
// //     }
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   const removeImage = () => {
// //     setUploadedImage(null);
// //     setImagePreview(null);
// //     if (fileInputRef.current) {
// //       fileInputRef.current.value = "";
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         height: "100%",
// //         display: "flex",
// //         flexDirection: "column",
// //         backgroundColor: "background.default",
// //       }}
// //     >
// //       {/* Messages Area */}
// //       <Box
// //         sx={{
// //           flex: 1,
// //           overflow: "auto",
// //           p: { xs: 1, md: 2 },
// //           "&::-webkit-scrollbar": {
// //             width: "8px",
// //           },
// //           "&::-webkit-scrollbar-track": {
// //             background: "transparent",
// //           },
// //           "&::-webkit-scrollbar-thumb": {
// //             background: "rgba(0,0,0,0.1)",
// //             borderRadius: "4px",
// //           },
// //         }}
// //       >
// //         {!currentSession?.messages.length && (
// //           <Box
// //             sx={{
// //               display: "flex",
// //               flexDirection: "column",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               height: "100%",
// //               textAlign: "center",
// //               gap: 3,
// //               px: 2,
// //             }}
// //           >
// //             <BotIcon
// //               sx={{
// //                 fontSize: { xs: 48, md: 64 },
// //                 color: "primary.main",
// //                 opacity: 0.7,
// //               }}
// //             />
// //             <Box>
// //               <Typography
// //                 variant="h4"
// //                 color="text.primary"
// //                 gutterBottom
// //                 sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
// //               >
// //                 AI Frontend Helper
// //               </Typography>
// //               <Typography
// //                 variant="body1"
// //                 color="text.secondary"
// //                 sx={{ maxWidth: 500, mb: 3 }}
// //               >
// //                 Transform your UI designs into production-ready code. Upload a
// //                 design, describe your vision, or ask for component guidance.
// //               </Typography>

// //               {/* Quick Start Chips */}
// //               <Box
// //                 sx={{
// //                   display: "flex",
// //                   flexWrap: "wrap",
// //                   gap: 1,
// //                   justifyContent: "center",
// //                 }}
// //               >
// //                 {quickPrompts.slice(0, 3).map((prompt, index) => (
// //                   <Chip
// //                     key={index}
// //                     label={prompt}
// //                     onClick={() => setMessage(prompt)}
// //                     sx={{
// //                       cursor: "pointer",
// //                       "&:hover": { bgcolor: "primary.50" },
// //                     }}
// //                     variant="outlined"
// //                   />
// //                 ))}
// //               </Box>
// //             </Box>
// //           </Box>
// //         )}

// //         {/* Messages List */}
// //         {currentSession?.messages.map((msg) => (
// //           <MessageBubble
// //             key={msg.id}
// //             message={msg}
// //             onSaveSnippet={onSaveSnippet}
// //             onCodeSelect={onCodeSelect}
// //           />
// //         ))}

// //         {/* Loading State */}
// //         {isLoading && (
// //           <Box
// //             sx={{
// //               display: "flex",
// //               alignItems: "center",
// //               gap: 2,
// //               p: 2,
// //               mb: 2,
// //             }}
// //           >
// //             <Avatar
// //               sx={{
// //                 bgcolor: "primary.main",
// //                 width: 32,
// //                 height: 32,
// //               }}
// //             >
// //               <BotIcon sx={{ fontSize: 18 }} />
// //             </Avatar>
// //             <Box>
// //               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //                 <CircularProgress size={16} />
// //                 <Typography variant="body2" color="text.secondary">
// //                   {processingStage || "Thinking..."}
// //                 </Typography>
// //               </Box>
// //             </Box>
// //           </Box>
// //         )}

// //         <div ref={messagesEndRef} />
// //       </Box>

// //       {/* Error Display */}
// //       {error && (
// //         <Box sx={{ p: 2, pt: 0 }}>
// //           <Alert
// //             severity="error"
// //             onClose={() => setError(null)}
// //             sx={{ borderRadius: 2 }}
// //           >
// //             {error}
// //           </Alert>
// //         </Box>
// //       )}

// //       {/* Image Preview */}
// //       {imagePreview && (
// //         <Box sx={{ p: 2, pt: 0 }}>
// //           <Paper
// //             sx={{
// //               p: 2,
// //               display: "flex",
// //               alignItems: "center",
// //               gap: 2,
// //               bgcolor: "grey.50",
// //               border: "1px solid",
// //               borderColor: "primary.main",
// //               borderRadius: 2,
// //             }}
// //           >
// //             <Box
// //               component="img"
// //               src={imagePreview}
// //               alt="Upload preview"
// //               sx={{
// //                 width: 60,
// //                 height: 60,
// //                 objectFit: "cover",
// //                 borderRadius: 1,
// //               }}
// //             />
// //             <Box sx={{ flex: 1 }}>
// //               <Typography variant="body2" fontWeight="medium">
// //                 {uploadedImage?.name}
// //               </Typography>
// //               <Typography variant="caption" color="text.secondary">
// //                 Ready to analyze •{" "}
// //                 {Math.round((uploadedImage?.size || 0) / 1024)} KB
// //               </Typography>
// //             </Box>
// //             <IconButton
// //               size="small"
// //               onClick={removeImage}
// //               sx={{ color: "text.secondary" }}
// //             >
// //               ×
// //             </IconButton>
// //           </Paper>
// //         </Box>
// //       )}

// //       {/* Input Area */}
// //       <Box
// //         sx={{
// //           p: 2,
// //           borderTop: 1,
// //           borderColor: "divider",
// //           backgroundColor: "background.paper",
// //         }}
// //       >
// //         <Box
// //           sx={{
// //             display: "flex",
// //             gap: 1,
// //             alignItems: "flex-end",
// //             maxWidth: "100%",
// //           }}
// //         >
// //           {/* Quick Prompts Button */}
// //           <IconButton
// //             onClick={(e) => setQuickMenuAnchor(e.currentTarget)}
// //             disabled={isLoading}
// //             sx={{
// //               color: "text.secondary",
// //               "&:hover": { color: "primary.main" },
// //             }}
// //           >
// //             <ExpandMoreIcon />
// //           </IconButton>

// //           {/* Image Upload Button */}
// //           <IconButton
// //             onClick={() => fileInputRef.current?.click()}
// //             disabled={isLoading}
// //             sx={{
// //               color: "text.secondary",
// //               "&:hover": { color: "primary.main" },
// //             }}
// //           >
// //             <ImageIcon />
// //           </IconButton>

// //           {/* Text Input */}
// //           <TextField
// //             fullWidth
// //             multiline
// //             maxRows={4}
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //             onKeyDown={handleKeyDown}
// //             placeholder="Describe your UI design or upload an image..."
// //             disabled={isLoading}
// //             sx={{
// //               "& .MuiOutlinedInput-root": {
// //                 borderRadius: 2,
// //               },
// //             }}
// //           />

// //           {/* Send Button */}
// //           <IconButton
// //             onClick={handleSendMessage}
// //             disabled={(!message.trim() && !uploadedImage) || isLoading}
// //             sx={{
// //               bgcolor: "primary.main",
// //               color: "white",
// //               "&:hover": { bgcolor: "primary.dark" },
// //               "&:disabled": {
// //                 bgcolor: "grey.300",
// //                 color: "grey.500",
// //               },
// //             }}
// //           >
// //             <SendIcon />
// //           </IconButton>
// //         </Box>

// //         {/* Helper Text */}
// //         <Typography
// //           variant="caption"
// //           color="text.secondary"
// //           sx={{ display: "block", mt: 1, textAlign: "center" }}
// //         >
// //           Upload images • Press Enter to send • Shift+Enter for new line
// //         </Typography>
// //       </Box>

// //       {/* Quick Prompts Menu */}
// //       <Menu
// //         anchorEl={quickMenuAnchor}
// //         open={Boolean(quickMenuAnchor)}
// //         onClose={() => setQuickMenuAnchor(null)}
// //         PaperProps={{
// //           sx: { maxWidth: 280, mt: 1 },
// //         }}
// //       >
// //         {quickPrompts.map((prompt, index) => (
// //           <MenuItem
// //             key={index}
// //             onClick={() => handleQuickPrompt(prompt)}
// //             sx={{ whiteSpace: "normal", py: 1.5 }}
// //           >
// //             <Typography variant="body2">{prompt}</Typography>
// //           </MenuItem>
// //         ))}
// //       </Menu>

// //       {/* Hidden File Input */}
// //       <input
// //         ref={fileInputRef}
// //         type="file"
// //         accept="image/*"
// //         onChange={handleFileSelect}
// //         style={{ display: "none" }}
// //       />
// //     </Box>
// //   );
// // }

// // "use client";

// // import React, { useState, useRef, useEffect } from "react";
// // import {
// //   Box,
// //   TextField,
// //   IconButton,
// //   Typography,
// //   Paper,
// //   Avatar,
// //   Menu,
// //   MenuItem,
// //   CircularProgress,
// //   Alert,
// //   Chip,
// // } from "@mui/material";
// // import {
// //   Send as SendIcon,
// //   Image as ImageIcon,
// //   SmartToy as BotIcon,
// //   ExpandMore as ExpandMoreIcon,
// // } from "@mui/icons-material";
// // import { ChatSession, Message, SavedSnippet } from "@/lib/types";
// // import { apiClient, validateImageFile } from "@/lib/utils";
// // import MessageBubble from "./MessageBubble";

// // interface ChatPanelProps {
// //   currentSession: ChatSession | null;
// //   onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
// //   onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
// //   onCodeSelect: (code: string, language: string) => void;
// // }

// // const quickPrompts = [
// //   "Analyze this UI design",
// //   "Give me a footer component in React TypeScript",
// //   "Create a responsive navbar",
// //   "How to build a login form?",
// //   "Generate a right drawer component",
// //   "Build a card component with hover effects",
// // ];

// // export default function ChatPanel({
// //   currentSession,
// //   onAddMessage,
// //   onSaveSnippet,
// //   onCodeSelect,
// // }: ChatPanelProps) {
// //   const [message, setMessage] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
// //   const [imagePreview, setImagePreview] = useState<string | null>(null);
// //   const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
// //     null
// //   );
// //   const [processingStage, setProcessingStage] = useState<string>("");

// //   const messagesEndRef = useRef<HTMLDivElement>(null);
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [currentSession?.messages]);

// //   // Determine request type: image analysis, code generation, or guidance
// //   const determineRequestType = (userMessage: string, hasImage: boolean) => {
// //     const lowerMessage = userMessage.toLowerCase();

// //     if (hasImage) return "vision";

// //     // Code generation keywords
// //     const codeKeywords = [
// //       "give me",
// //       "create",
// //       "generate",
// //       "build",
// //       "make",
// //       "write code",
// //       "component",
// //       "function",
// //     ];
// //     const hasCodeKeyword = codeKeywords.some((keyword) =>
// //       lowerMessage.includes(keyword)
// //     );

// //     // Guidance keywords
// //     const guidanceKeywords = [
// //       "how to",
// //       "guide",
// //       "tutorial",
// //       "explain",
// //       "learn",
// //       "teach me",
// //       "steps",
// //       "guidelines",
// //     ];
// //     const hasGuidanceKeyword = guidanceKeywords.some((keyword) =>
// //       lowerMessage.includes(keyword)
// //     );

// //     if (hasCodeKeyword && !hasGuidanceKeyword) return "code";
// //     if (hasGuidanceKeyword) return "guidance";

// //     // Default to guidance for general questions
// //     return "guidance";
// //   };

// //   const handleSendMessage = async () => {
// //     if (!message.trim() && !uploadedImage) return;

// //     const userMessage = message.trim();
// //     const hasImage = !!uploadedImage;
// //     const requestType = determineRequestType(userMessage, hasImage);

// //     setError(null);
// //     setIsLoading(true);

// //     try {
// //       // Add user message
// //       const userMsg: Omit<Message, "id" | "timestamp"> = {
// //         type: "user",
// //         content: userMessage || "Analyze this image",
// //         image: imagePreview || undefined,
// //       };
// //       onAddMessage(userMsg);
// //       setMessage("");

// //       // ROUTE 1: Vision Analysis (Image Upload)
// //       if (requestType === "vision" && uploadedImage) {
// //         setProcessingStage("Analyzing image...");

// //         const visionResponse = await apiClient.analyzeImage(
// //           uploadedImage,
// //           userMessage
// //         );

// //         // Format vision response as a detailed message
// //         const visionMsg: Omit<Message, "id" | "timestamp"> = {
// //           type: "assistant",
// //           content: formatVisionResponse(visionResponse),
// //         };
// //         onAddMessage(visionMsg);

// //         // Auto-display first file's code if available
// //         if (visionResponse.filesList && visionResponse.filesList.length > 0) {
// //           const firstFile = visionResponse.filesList[0];
// //           onCodeSelect(
// //             `// ${firstFile.path}\n// ${firstFile.purpose}\n\n// File structure ready for implementation`,
// //             "typescript"
// //           );
// //         }
// //       }
// //       // ROUTE 2: Code Generation (Direct code request)
// //       else if (requestType === "code") {
// //         setProcessingStage("Generating code...");

// //         const codeResponse = await apiClient.generateCode({
// //           prompt: userMessage,
// //           language: "typescript",
// //           framework: "react",
// //           includeTests: false,
// //           includeComments: true,
// //         });

// //         const codeMsg: Omit<Message, "id" | "timestamp"> = {
// //           type: "assistant",
// //           content: formatCodeResponse(codeResponse),
// //         };
// //         onAddMessage(codeMsg);

// //         // Display the generated code
// //         if (codeResponse.mainCode && codeResponse.mainCode.code) {
// //           onCodeSelect(
// //             codeResponse.mainCode.code,
// //             codeResponse.mainCode.language
// //           );
// //         }
// //       }
// //       // ROUTE 3: Guidance/Tutorial (Learning request)
// //       else {
// //         setProcessingStage("Generating guidance...");

// //         const guidanceResponse = await apiClient.generateGuidance(userMessage);

// //         const guidanceMsg: Omit<Message, "id" | "timestamp"> = {
// //           type: "assistant",
// //           content: formatGuidanceResponse(guidanceResponse),
// //         };
// //         onAddMessage(guidanceMsg);

// //         // Display code example if available
// //         if (guidanceResponse.content?.completeExample?.code) {
// //           onCodeSelect(
// //             guidanceResponse.content.completeExample.code,
// //             "typescript"
// //           );
// //         }
// //       }
// //     } catch (err) {
// //       console.error("API Error:", err);

// //       let errorMessage = "I encountered an error processing your request. ";

// //       if (err instanceof Error) {
// //         if (err.message.includes("Rate limit")) {
// //           errorMessage += "Too many requests. Please wait a moment.";
// //         } else if (err.message.includes("API")) {
// //           errorMessage += "AI service temporarily unavailable.";
// //         } else {
// //           errorMessage += "Please try again or rephrase your request.";
// //         }
// //       }

// //       setError(errorMessage);

// //       const errorMsg: Omit<Message, "id" | "timestamp"> = {
// //         type: "assistant",
// //         content: `❌ ${errorMessage}\n\nTry:\n- Rephrasing your request\n- Checking image format (PNG/JPG)\n- Refreshing the page`,
// //       };
// //       onAddMessage(errorMsg);
// //     } finally {
// //       setIsLoading(false);
// //       setProcessingStage("");
// //       setUploadedImage(null);
// //       setImagePreview(null);
// //       if (fileInputRef.current) fileInputRef.current.value = "";
// //     }
// //   };

// //   // Format vision analysis response
// //   const formatVisionResponse = (response: any): string => {
// //     let formatted = `## 🎨 UI Analysis: ${response.pageType}\n\n`;
// //     formatted += `${response.description}\n\n`;

// //     if (response.uiElements?.length > 0) {
// //       formatted += `### 📋 Identified UI Elements\n`;
// //       response.uiElements.forEach(
// //         (elem: string) => (formatted += `- ${elem}\n`)
// //       );
// //       formatted += `\n`;
// //     }

// //     if (response.folderStructure?.length > 0) {
// //       formatted += `### 📁 Recommended Folder Structure\n\`\`\`\n`;
// //       response.folderStructure.forEach(
// //         (line: string) => (formatted += `${line}\n`)
// //       );
// //       formatted += `\`\`\`\n\n`;
// //     }

// //     if (response.filesList?.length > 0) {
// //       formatted += `### 📄 Required Files (${response.filesList.length})\n`;
// //       response.filesList.forEach((file: any) => {
// //         formatted += `**${file.path}**\n- ${file.purpose}\n\n`;
// //       });
// //     }

// //     if (response.stepByStepGuide?.length > 0) {
// //       formatted += `### 🚀 Implementation Steps\n`;
// //       response.stepByStepGuide.forEach((step: any) => {
// //         formatted += `**Step ${step.step}: ${step.title}**\n`;
// //         formatted += `${step.description}\n`;
// //         if (step.commands?.length > 0) {
// //           formatted += `\`\`\`bash\n${step.commands.join("\n")}\n\`\`\`\n`;
// //         }
// //         formatted += `\n`;
// //       });
// //     }

// //     if (response.recommendedTech) {
// //       formatted += `### 🛠️ Technology Stack\n`;
// //       Object.entries(response.recommendedTech).forEach(
// //         ([key, value]: [string, any]) => {
// //           if (Array.isArray(value) && value.length > 0) {
// //             formatted += `**${key}**: ${value.join(", ")}\n`;
// //           }
// //         }
// //       );
// //     }

// //     return formatted;
// //   };

// //   // Format code generation response
// //   const formatCodeResponse = (response: any): string => {
// //     let formatted = `## 💻 ${response.title || "Generated Code"}\n\n`;
// //     formatted += `${response.description || ""}\n\n`;

// //     if (response.mainCode) {
// //       formatted += `### 📝 Main Implementation\n`;
// //       formatted += `**File**: \`${response.mainCode.filename}\`\n\n`;
// //       formatted += `${response.mainCode.explanation}\n\n`;
// //       formatted += `\`\`\`${response.mainCode.language}\n${response.mainCode.code}\n\`\`\`\n\n`;
// //     }

// //     if (response.features?.length > 0) {
// //       formatted += `### ✨ Features\n`;
// //       response.features.forEach(
// //         (feature: string) => (formatted += `- ${feature}\n`)
// //       );
// //       formatted += `\n`;
// //     }

// //     if (response.usage?.example) {
// //       formatted += `### 📖 Usage\n\`\`\`tsx\n${response.usage.example}\n\`\`\`\n\n`;
// //     }

// //     if (response.dependencies?.length > 0) {
// //       formatted += `### 📦 Dependencies\n\`\`\`bash\n`;
// //       response.dependencies.forEach((dep: any) => {
// //         formatted += `npm install ${dep.name}  # ${dep.purpose}\n`;
// //       });
// //       formatted += `\`\`\`\n\n`;
// //     }

// //     if (response.bestPractices?.length > 0) {
// //       formatted += `### ✅ Best Practices\n`;
// //       response.bestPractices.forEach(
// //         (practice: string) => (formatted += `- ${practice}\n`)
// //       );
// //     }

// //     return formatted;
// //   };

// //   // Format guidance response
// //   const formatGuidanceResponse = (response: any): string => {
// //     const content = response.content;
// //     let formatted = `## 📚 ${content.title || "Programming Guidance"}\n\n`;
// //     formatted += `${content.overview || ""}\n\n`;

// //     if (content.difficulty || content.estimatedTime) {
// //       formatted += `**Difficulty**: ${
// //         content.difficulty || "N/A"
// //       } | **Time**: ${content.estimatedTime || "N/A"}\n\n`;
// //     }

// //     if (content.prerequisites?.length > 0) {
// //       formatted += `### 📋 Prerequisites\n`;
// //       content.prerequisites.forEach(
// //         (req: string) => (formatted += `- ${req}\n`)
// //       );
// //       formatted += `\n`;
// //     }

// //     if (content.stepByStepGuide?.length > 0) {
// //       formatted += `### 🎯 Step-by-Step Guide\n\n`;
// //       content.stepByStepGuide.forEach((step: any) => {
// //         formatted += `#### Step ${step.step}: ${step.title}\n`;
// //         formatted += `${step.description}\n\n`;
// //         if (step.codeExample) {
// //           formatted += `\`\`\`javascript\n${step.codeExample}\n\`\`\`\n`;
// //         }
// //         if (step.explanation) {
// //           formatted += `${step.explanation}\n\n`;
// //         }
// //       });
// //     }

// //     if (content.completeExample?.code) {
// //       formatted += `### 🔥 Complete Example\n`;
// //       formatted += `${content.completeExample.explanation || ""}\n\n`;
// //       formatted += `\`\`\`javascript\n${content.completeExample.code}\n\`\`\`\n\n`;
// //     }

// //     if (content.bestPractices?.length > 0) {
// //       formatted += `### ✅ Best Practices\n`;
// //       content.bestPractices.forEach(
// //         (practice: string) => (formatted += `- ${practice}\n`)
// //       );
// //     }

// //     return formatted;
// //   };

// //   const handleImageUpload = (file: File) => {
// //     const validationError = validateImageFile(file);
// //     if (validationError) {
// //       setError(validationError);
// //       return;
// //     }

// //     setUploadedImage(file);
// //     const reader = new FileReader();
// //     reader.onload = (e) => setImagePreview(e.target?.result as string);
// //     reader.readAsDataURL(file);
// //     setError(null);
// //   };

// //   const handleQuickPrompt = (prompt: string) => {
// //     setMessage(prompt);
// //     setQuickMenuAnchor(null);
// //   };

// //   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) handleImageUpload(file);
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   const removeImage = () => {
// //     setUploadedImage(null);
// //     setImagePreview(null);
// //     if (fileInputRef.current) fileInputRef.current.value = "";
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         height: "100%",
// //         display: "flex",
// //         flexDirection: "column",
// //         backgroundColor: "background.default",
// //       }}
// //     >
// //       {/* Messages Area */}
// //       <Box
// //         sx={{
// //           flex: 1,
// //           overflow: "auto",
// //           p: { xs: 1, md: 2 },
// //           "&::-webkit-scrollbar": { width: "8px" },
// //           "&::-webkit-scrollbar-track": { background: "transparent" },
// //           "&::-webkit-scrollbar-thumb": {
// //             background: "rgba(0,0,0,0.1)",
// //             borderRadius: "4px",
// //           },
// //         }}
// //       >
// //         {!currentSession?.messages.length && (
// //           <Box
// //             sx={{
// //               display: "flex",
// //               flexDirection: "column",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               height: "100%",
// //               textAlign: "center",
// //               gap: 3,
// //               px: 2,
// //             }}
// //           >
// //             <BotIcon
// //               sx={{
// //                 fontSize: { xs: 48, md: 64 },
// //                 color: "primary.main",
// //                 opacity: 0.7,
// //               }}
// //             />
// //             <Box>
// //               <Typography
// //                 variant="h4"
// //                 color="text.primary"
// //                 gutterBottom
// //                 sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
// //               >
// //                 AI Frontend Helper
// //               </Typography>
// //               <Typography
// //                 variant="body1"
// //                 color="text.secondary"
// //                 sx={{ maxWidth: 500, mb: 3 }}
// //               >
// //                 Upload UI designs for analysis, get step-by-step coding
// //                 guidance, or generate production-ready code instantly.
// //               </Typography>

// //               <Box
// //                 sx={{
// //                   display: "flex",
// //                   flexWrap: "wrap",
// //                   gap: 1,
// //                   justifyContent: "center",
// //                 }}
// //               >
// //                 {quickPrompts.slice(0, 3).map((prompt, index) => (
// //                   <Chip
// //                     key={index}
// //                     label={prompt}
// //                     onClick={() => setMessage(prompt)}
// //                     sx={{
// //                       cursor: "pointer",
// //                       "&:hover": { bgcolor: "primary.50" },
// //                     }}
// //                     variant="outlined"
// //                   />
// //                 ))}
// //               </Box>
// //             </Box>
// //           </Box>
// //         )}

// //         {currentSession?.messages.map((msg) => (
// //           <MessageBubble
// //             key={msg.id}
// //             message={msg}
// //             onSaveSnippet={onSaveSnippet}
// //             onCodeSelect={onCodeSelect}
// //           />
// //         ))}

// //         {isLoading && (
// //           <Box
// //             sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, mb: 2 }}
// //           >
// //             <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
// //               <BotIcon sx={{ fontSize: 18 }} />
// //             </Avatar>
// //             <Box>
// //               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //                 <CircularProgress size={16} />
// //                 <Typography variant="body2" color="text.secondary">
// //                   {processingStage || "Processing..."}
// //                 </Typography>
// //               </Box>
// //             </Box>
// //           </Box>
// //         )}

// //         <div ref={messagesEndRef} />
// //       </Box>

// //       {error && (
// //         <Box sx={{ p: 2, pt: 0 }}>
// //           <Alert
// //             severity="error"
// //             onClose={() => setError(null)}
// //             sx={{ borderRadius: 2 }}
// //           >
// //             {error}
// //           </Alert>
// //         </Box>
// //       )}

// //       {imagePreview && (
// //         <Box sx={{ p: 2, pt: 0 }}>
// //           <Paper
// //             sx={{
// //               p: 2,
// //               display: "flex",
// //               alignItems: "center",
// //               gap: 2,
// //               bgcolor: "grey.50",
// //               border: "1px solid",
// //               borderColor: "primary.main",
// //               borderRadius: 2,
// //             }}
// //           >
// //             <Box
// //               component="img"
// //               src={imagePreview}
// //               alt="Upload preview"
// //               sx={{
// //                 width: 60,
// //                 height: 60,
// //                 objectFit: "cover",
// //                 borderRadius: 1,
// //               }}
// //             />
// //             <Box sx={{ flex: 1 }}>
// //               <Typography variant="body2" fontWeight="medium">
// //                 {uploadedImage?.name}
// //               </Typography>
// //               <Typography variant="caption" color="text.secondary">
// //                 Ready to analyze •{" "}
// //                 {Math.round((uploadedImage?.size || 0) / 1024)} KB
// //               </Typography>
// //             </Box>
// //             <IconButton
// //               size="small"
// //               onClick={removeImage}
// //               sx={{ color: "text.secondary" }}
// //             >
// //               ×
// //             </IconButton>
// //           </Paper>
// //         </Box>
// //       )}

// //       <Box
// //         sx={{
// //           p: 2,
// //           borderTop: 1,
// //           borderColor: "divider",
// //           backgroundColor: "background.paper",
// //         }}
// //       >
// //         <Box
// //           sx={{
// //             display: "flex",
// //             gap: 1,
// //             alignItems: "flex-end",
// //             maxWidth: "100%",
// //           }}
// //         >
// //           <IconButton
// //             onClick={(e) => setQuickMenuAnchor(e.currentTarget)}
// //             disabled={isLoading}
// //             sx={{
// //               color: "text.secondary",
// //               "&:hover": { color: "primary.main" },
// //             }}
// //           >
// //             <ExpandMoreIcon />
// //           </IconButton>

// //           <IconButton
// //             onClick={() => fileInputRef.current?.click()}
// //             disabled={isLoading}
// //             sx={{
// //               color: "text.secondary",
// //               "&:hover": { color: "primary.main" },
// //             }}
// //           >
// //             <ImageIcon />
// //           </IconButton>

// //           <TextField
// //             fullWidth
// //             multiline
// //             maxRows={4}
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //             onKeyDown={handleKeyDown}
// //             placeholder="Upload image, ask for guidance, or request code..."
// //             disabled={isLoading}
// //             sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
// //           />

// //           <IconButton
// //             onClick={handleSendMessage}
// //             disabled={(!message.trim() && !uploadedImage) || isLoading}
// //             sx={{
// //               bgcolor: "primary.main",
// //               color: "white",
// //               "&:hover": { bgcolor: "primary.dark" },
// //               "&:disabled": { bgcolor: "grey.300", color: "grey.500" },
// //             }}
// //           >
// //             <SendIcon />
// //           </IconButton>
// //         </Box>

// //         <Typography
// //           variant="caption"
// //           color="text.secondary"
// //           sx={{ display: "block", mt: 1, textAlign: "center" }}
// //         >
// //           Upload images • Ask for guidance • Generate code • Press Enter to send
// //         </Typography>
// //       </Box>

// //       <Menu
// //         anchorEl={quickMenuAnchor}
// //         open={Boolean(quickMenuAnchor)}
// //         onClose={() => setQuickMenuAnchor(null)}
// //         PaperProps={{ sx: { maxWidth: 280, mt: 1 } }}
// //       >
// //         {quickPrompts.map((prompt, index) => (
// //           <MenuItem
// //             key={index}
// //             onClick={() => handleQuickPrompt(prompt)}
// //             sx={{ whiteSpace: "normal", py: 1.5 }}
// //           >
// //             <Typography variant="body2">{prompt}</Typography>
// //           </MenuItem>
// //         ))}
// //       </Menu>

// //       <input
// //         ref={fileInputRef}
// //         type="file"
// //         accept="image/*"
// //         onChange={handleFileSelect}
// //         style={{ display: "none" }}
// //       />
// //     </Box>
// //   );
// // }

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   IconButton,
//   Typography,
//   Paper,
//   Avatar,
//   Menu,
//   MenuItem,
//   CircularProgress,
//   Alert,
//   Chip,
//   Card,
//   CardContent,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Button,
//   Collapse,
// } from "@mui/material";
// import {
//   Send as SendIcon,
//   Image as ImageIcon,
//   SmartToy as BotIcon,
//   ExpandMore as ExpandMoreIcon,
//   Code as CodeIcon,
//   School as SchoolIcon,
//   Build as BuildIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Lightbulb as LightbulbIcon,
//   Schedule as ScheduleIcon,
//   TrendingUp as TrendingUpIcon,
//   Psychology as PsychologyIcon,
//   ExpandMore,
//   ChevronRight,
//   ContentCopy,
//   PlayArrow,
//   Visibility,
// } from "@mui/icons-material";
// import { ChatSession, Message, SavedSnippet } from "@/lib/types";
// import { apiClient, validateImageFile } from "@/lib/utils";
// import MessageBubble from "./MessageBubble";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// // import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// interface ChatPanelProps {
//   currentSession: ChatSession | null;
//   onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
//   onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
//   onCodeSelect: (code: string, language: string) => void;
// }

// const quickPrompts = [
//   "Explain React hooks for beginners",
//   "Create a responsive navbar component",
//   "How to become a frontend developer in 2024?",
//   "Build a login form with validation",
//   "What is JavaScript closure?",
//   "Generate a dashboard layout component",
// ];

// export default function ChatPanel({
//   currentSession,
//   onAddMessage,
//   onSaveSnippet,
//   onCodeSelect,
// }: ChatPanelProps) {
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
//     null
//   );
//   const [processingStage, setProcessingStage] = useState<string>("");
//   const [expandedSections, setExpandedSections] = useState<Set<string>>(
//     new Set()
//   );

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [currentSession?.messages]);

//   const toggleSection = (sectionId: string) => {
//     const newExpanded = new Set(expandedSections);
//     if (newExpanded.has(sectionId)) {
//       newExpanded.delete(sectionId);
//     } else {
//       newExpanded.add(sectionId);
//     }
//     setExpandedSections(newExpanded);
//   };

//   const determineRequestType = (userMessage: string, hasImage: boolean) => {
//     const lowerMessage = userMessage.toLowerCase();

//     if (hasImage) return "vision";

//     const codeKeywords = [
//       "give me",
//       "create",
//       "generate",
//       "build",
//       "make",
//       "write code",
//       "component",
//       "function",
//       "code for",
//     ];
//     const hasCodeKeyword = codeKeywords.some((keyword) =>
//       lowerMessage.includes(keyword)
//     );

//     const guidanceKeywords = [
//       "how to",
//       "guide",
//       "tutorial",
//       "explain",
//       "learn",
//       "teach me",
//       "steps",
//       "guidelines",
//       "what is",
//       "understand",
//     ];
//     const hasGuidanceKeyword = guidanceKeywords.some((keyword) =>
//       lowerMessage.includes(keyword)
//     );

//     if (hasCodeKeyword && !hasGuidanceKeyword) return "code";
//     if (hasGuidanceKeyword) return "guidance";

//     return "guidance";
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() && !uploadedImage) return;

//     const userMessage = message.trim();
//     const hasImage = !!uploadedImage;
//     const requestType = determineRequestType(userMessage, hasImage);

//     setError(null);
//     setIsLoading(true);

//     try {
//       const userMsg: Omit<Message, "id" | "timestamp"> = {
//         type: "user",
//         content: userMessage || "Analyze this image",
//         image: imagePreview || undefined,
//       };
//       onAddMessage(userMsg);
//       setMessage("");

//       if (requestType === "vision" && uploadedImage) {
//         setProcessingStage("Analyzing image...");
//         const visionResponse = await apiClient.analyzeImage(
//           uploadedImage,
//           userMessage
//         );
//         const visionMsg: Omit<Message, "id" | "timestamp"> = {
//           type: "assistant",
//           content: "",
//           data: { type: "vision", response: visionResponse },
//         };
//         onAddMessage(visionMsg);
//       } else if (requestType === "code") {
//         setProcessingStage("Generating code...");
//         const codeResponse = await apiClient.generateCode({
//           prompt: userMessage,
//           language: "typescript",
//           framework: "react",
//           includeTests: false,
//           includeComments: true,
//         });
//         const codeMsg: Omit<Message, "id" | "timestamp"> = {
//           type: "assistant",
//           content: "",
//           data: { type: "code", response: codeResponse },
//         };
//         onAddMessage(codeMsg);
//         if (codeResponse.mainCode?.code) {
//           onCodeSelect(
//             codeResponse.mainCode.code,
//             codeResponse.mainCode.language
//           );
//         }
//       } else {
//         setProcessingStage("Generating guidance...");
//         const guidanceResponse = await apiClient.generateGuidance(userMessage);
//         const guidanceMsg: Omit<Message, "id" | "timestamp"> = {
//           type: "assistant",
//           content: "",
//           data: { type: "guidance", response: guidanceResponse },
//         };
//         onAddMessage(guidanceMsg);
//         if (guidanceResponse.content?.completeExample?.code) {
//           onCodeSelect(
//             guidanceResponse.content.completeExample.code,
//             "typescript"
//           );
//         }
//       }
//     } catch (err) {
//       console.error("API Error:", err);
//       const errorMessage =
//         "I encountered an error processing your request. Please try again.";
//       setError(errorMessage);
//       const errorMsg: Omit<Message, "id" | "timestamp"> = {
//         type: "assistant",
//         content: `❌ ${errorMessage}`,
//       };
//       onAddMessage(errorMsg);
//     } finally {
//       setIsLoading(false);
//       setProcessingStage("");
//       setUploadedImage(null);
//       setImagePreview(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   // Render Guidance Response
//   const renderGuidanceResponse = (response: any) => {
//     const content = response.content;
//     return (
//       <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
//         {/* Header */}
//         <Card sx={{ mb: 2, bgcolor: "primary.50", border: "none" }}>
//           <CardContent>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
//               <SchoolIcon color="primary" />
//               <Typography variant="h6" fontWeight="bold">
//                 {content.title || "Programming Guidance"}
//               </Typography>
//             </Box>
//             <Typography variant="body1" color="text.secondary">
//               {content.overview}
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
//               <Chip
//                 icon={<ScheduleIcon />}
//                 label={`Time: ${content.estimatedTime || "Varies"}`}
//                 size="small"
//                 variant="outlined"
//               />
//               <Chip
//                 icon={<PsychologyIcon />}
//                 label={`Level: ${content.difficulty || "All Levels"}`}
//                 size="small"
//                 variant="outlined"
//               />
//               <Chip
//                 icon={<TrendingUpIcon />}
//                 label={content.category || "General"}
//                 size="small"
//                 variant="outlined"
//               />
//             </Box>
//           </CardContent>
//         </Card>

//         {/* Prerequisites */}
//         {content.prerequisites?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">📋 Prerequisites</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List dense>
//                 {content.prerequisites.map((prereq: string, index: number) => (
//                   <ListItem key={index}>
//                     <ListItemIcon sx={{ minWidth: 32 }}>
//                       <CheckCircleIcon color="success" fontSize="small" />
//                     </ListItemIcon>
//                     <ListItemText primary={prereq} />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Learning Objectives */}
//         {content.learningObjectives?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">🎯 What You'll Learn</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List dense>
//                 {content.learningObjectives.map(
//                   (objective: string, index: number) => (
//                     <ListItem key={index}>
//                       <ListItemIcon sx={{ minWidth: 32 }}>
//                         <LightbulbIcon color="warning" fontSize="small" />
//                       </ListItemIcon>
//                       <ListItemText primary={objective} />
//                     </ListItem>
//                   )
//                 )}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Step-by-Step Guide */}
//         {content.stepByStepGuide?.length > 0 && (
//           <Accordion defaultExpanded>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">🚀 Step-by-Step Guide</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//                 {content.stepByStepGuide.map((step: any, index: number) => (
//                   <Card key={index} variant="outlined" sx={{ mb: 2 }}>
//                     <CardContent>
//                       <Box
//                         sx={{ display: "flex", alignItems: "start", gap: 2 }}
//                       >
//                         <Avatar
//                           sx={{
//                             bgcolor: "primary.main",
//                             width: 32,
//                             height: 32,
//                           }}
//                         >
//                           {step.step}
//                         </Avatar>
//                         <Box sx={{ flex: 1 }}>
//                           <Typography variant="h6" gutterBottom>
//                             {step.title}
//                           </Typography>
//                           <Typography
//                             variant="body2"
//                             color="text.secondary"
//                             paragraph
//                           >
//                             {step.description}
//                           </Typography>

//                           {step.codeExample && (
//                             <Box sx={{ mt: 2 }}>
//                               <Typography variant="subtitle2" gutterBottom>
//                                 Code Example:
//                               </Typography>
//                               <SyntaxHighlighter
//                                 language="typescript"
//                                 // style={vscDarkPlus}
//                                 customStyle={{
//                                   borderRadius: 8,
//                                   fontSize: "0.85em",
//                                 }}
//                               >
//                                 {step.codeExample}
//                               </SyntaxHighlighter>
//                             </Box>
//                           )}

//                           {step.tips?.length > 0 && (
//                             <Box sx={{ mt: 2 }}>
//                               <Typography variant="subtitle2" gutterBottom>
//                                 💡 Pro Tips:
//                               </Typography>
//                               <List dense>
//                                 {step.tips.map(
//                                   (tip: string, tipIndex: number) => (
//                                     <ListItem key={tipIndex}>
//                                       <ListItemText primary={tip} />
//                                     </ListItem>
//                                   )
//                                 )}
//                               </List>
//                             </Box>
//                           )}
//                         </Box>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </Box>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Complete Example */}
//         {content.completeExample?.code && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">🔥 Complete Example</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography variant="body2" paragraph>
//                 {content.completeExample.description}
//               </Typography>
//               <SyntaxHighlighter
//                 language="typescript"
//                 // style={vscDarkPlus}
//                 customStyle={{ borderRadius: 8 }}
//               >
//                 {content.completeExample.code}
//               </SyntaxHighlighter>
//               <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//                 <Button
//                   variant="outlined"
//                   startIcon={<ContentCopy />}
//                   size="small"
//                   onClick={() =>
//                     navigator.clipboard.writeText(content.completeExample.code)
//                   }
//                 >
//                   Copy Code
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<PlayArrow />}
//                   size="small"
//                   onClick={() =>
//                     onCodeSelect(content.completeExample.code, "typescript")
//                   }
//                 >
//                   Use in Editor
//                 </Button>
//               </Box>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Best Practices */}
//         {content.bestPractices?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">✅ Best Practices</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List>
//                 {content.bestPractices.map((practice: any, index: number) => (
//                   <ListItem key={index}>
//                     <ListItemIcon>
//                       <CheckCircleIcon color="success" />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={practice.practice || practice}
//                       secondary={practice.reason || "Industry standard"}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Next Steps */}
//         {content.nextSteps?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">📚 Continue Learning</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List>
//                 {content.nextSteps.map((next: any, index: number) => (
//                   <ListItem key={index}>
//                     <ListItemIcon>
//                       <ChevronRight color="primary" />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={next.step || next}
//                       secondary={next.reason || "Recommended next topic"}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}
//       </Box>
//     );
//   };

//   // Render Code Response
//   const renderCodeResponse = (response: any) => {
//     return (
//       <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
//         {/* Header */}
//         <Card sx={{ mb: 2, bgcolor: "success.50", border: "none" }}>
//           <CardContent>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
//               <CodeIcon color="success" />
//               <Typography variant="h6" fontWeight="bold">
//                 {response.title || "Generated Code"}
//               </Typography>
//             </Box>
//             <Typography variant="body1" color="text.secondary">
//               {response.description}
//             </Typography>
//             {response.overview && (
//               <Box sx={{ mt: 1 }}>
//                 <Typography variant="body2">
//                   <strong>Purpose:</strong> {response.overview.purpose}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Complexity:</strong> {response.overview.complexity}
//                 </Typography>
//               </Box>
//             )}
//           </CardContent>
//         </Card>

//         {/* Main Code */}
//         {response.mainCode && (
//           <Accordion defaultExpanded>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <CodeIcon color="primary" />
//                 <Typography fontWeight="bold">
//                   Main Code ({response.mainCode.filename})
//                 </Typography>
//               </Box>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography variant="body2" color="text.secondary" paragraph>
//                 {response.mainCode.explanation}
//               </Typography>
//               <SyntaxHighlighter
//                 language={response.mainCode.language || "typescript"}
//                 // style={vscDarkPlus}
//                 customStyle={{ borderRadius: 8, fontSize: "0.85em" }}
//                 showLineNumbers
//               >
//                 {response.mainCode.code}
//               </SyntaxHighlighter>
//               <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<ContentCopy />}
//                   size="small"
//                   onClick={() =>
//                     navigator.clipboard.writeText(response.mainCode.code)
//                   }
//                 >
//                   Copy Code
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<PlayArrow />}
//                   size="small"
//                   onClick={() =>
//                     onCodeSelect(
//                       response.mainCode.code,
//                       response.mainCode.language
//                     )
//                   }
//                 >
//                   Open in Editor
//                 </Button>
//               </Box>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Features */}
//         {response.features?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">✨ Features</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List dense>
//                 {response.features.map((feature: any, index: number) => (
//                   <ListItem key={index}>
//                     <ListItemIcon sx={{ minWidth: 32 }}>
//                       <CheckCircleIcon color="success" fontSize="small" />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={feature.feature || feature}
//                       secondary={feature.description || feature.howItWorks}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Usage */}
//         {response.usage && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">📖 How to Use</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography variant="body2" paragraph>
//                 {response.usage.description}
//               </Typography>
//               {response.usage.example && (
//                 <SyntaxHighlighter
//                   language="typescript"
//                   // style={vscDarkPlus}
//                   customStyle={{ borderRadius: 8, fontSize: "0.85em" }}
//                 >
//                   {response.usage.example}
//                 </SyntaxHighlighter>
//               )}
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Dependencies */}
//         {response.dependencies?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">📦 Dependencies</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List dense>
//                 {response.dependencies.map((dep: any, index: number) => (
//                   <ListItem key={index}>
//                     <ListItemIcon sx={{ minWidth: 32 }}>
//                       <BuildIcon color="action" fontSize="small" />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={`${dep.name} ${dep.version}`}
//                       secondary={dep.purpose}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Best Practices */}
//         {response.bestPractices?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">✅ Best Practices</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List>
//                 {response.bestPractices.map((practice: any, index: number) => (
//                   <ListItem key={index}>
//                     <ListItemIcon>
//                       <CheckCircleIcon color="success" />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={practice.practice}
//                       secondary={
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">
//                             {practice.why}
//                           </Typography>
//                           {practice.example && (
//                             <SyntaxHighlighter
//                               language="typescript"
//                               // style={vscDarkPlus}
//                               customStyle={{
//                                 borderRadius: 4,
//                                 fontSize: "0.75em",
//                                 marginTop: 8,
//                               }}
//                             >
//                               {practice.example}
//                             </SyntaxHighlighter>
//                           )}
//                         </Box>
//                       }
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}
//       </Box>
//     );
//   };

//   // Render Vision Response
//   const renderVisionResponse = (response: any) => {
//     return (
//       <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
//         <Card sx={{ mb: 2, bgcolor: "info.50", border: "none" }}>
//           <CardContent>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
//               <Visibility color="info" />
//               <Typography variant="h6" fontWeight="bold">
//                 🎨 UI Analysis: {response.pageType}
//               </Typography>
//             </Box>
//             <Typography variant="body1" color="text.secondary">
//               {response.description}
//             </Typography>
//           </CardContent>
//         </Card>

//         {/* UI Elements */}
//         {response.uiElements?.length > 0 && (
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">
//                 📋 Identified Components
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                 {response.uiElements.map((element: string, index: number) => (
//                   <Chip key={index} label={element} variant="outlined" />
//                 ))}
//               </Box>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {/* Implementation Steps */}
//         {response.stepByStepGuide?.length > 0 && (
//           <Accordion defaultExpanded>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography fontWeight="bold">🚀 Implementation Steps</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List>
//                 {response.stepByStepGuide.map((step: any, index: number) => (
//                   <ListItem key={index}>
//                     <ListItemIcon>
//                       <Avatar
//                         sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
//                       >
//                         {step.step}
//                       </Avatar>
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={step.title}
//                       secondary={step.description}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}
//       </Box>
//     );
//   };

//   const handleImageUpload = (file: File) => {
//     const validationError = validateImageFile(file);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }
//     setUploadedImage(file);
//     const reader = new FileReader();
//     reader.onload = (e) => setImagePreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//     setError(null);
//   };

//   const handleQuickPrompt = (prompt: string) => {
//     setMessage(prompt);
//     setQuickMenuAnchor(null);
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) handleImageUpload(file);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const removeImage = () => {
//     setUploadedImage(null);
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <Box
//       sx={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         backgroundColor: "background.default",
//       }}
//     >
//       {/* Messages Area */}
//       <Box
//         sx={{
//           flex: 1,
//           overflow: "auto",
//           p: { xs: 1, md: 2 },
//           "&::-webkit-scrollbar": { width: "8px" },
//           "&::-webkit-scrollbar-track": { background: "transparent" },
//           "&::-webkit-scrollbar-thumb": {
//             background: "rgba(0,0,0,0.1)",
//             borderRadius: "4px",
//           },
//         }}
//       >
//         {!currentSession?.messages.length && (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "100%",
//               textAlign: "center",
//               gap: 3,
//               px: 2,
//             }}
//           >
//             <BotIcon
//               sx={{
//                 fontSize: { xs: 48, md: 64 },
//                 color: "primary.main",
//                 opacity: 0.7,
//               }}
//             />
//             <Box>
//               <Typography
//                 variant="h4"
//                 color="text.primary"
//                 gutterBottom
//                 sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
//               >
//                 AI Frontend Helper
//               </Typography>
//               <Typography
//                 variant="body1"
//                 color="text.secondary"
//                 sx={{ maxWidth: 500, mb: 3 }}
//               >
//                 Get step-by-step coding guidance, generate production-ready
//                 components, or analyze UI designs with AI assistance.
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: 1,
//                   justifyContent: "center",
//                 }}
//               >
//                 {quickPrompts.slice(0, 3).map((prompt, index) => (
//                   <Chip
//                     key={index}
//                     label={prompt}
//                     onClick={() => setMessage(prompt)}
//                     sx={{
//                       cursor: "pointer",
//                       "&:hover": { bgcolor: "primary.50" },
//                     }}
//                     variant="outlined"
//                   />
//                 ))}
//               </Box>
//             </Box>
//           </Box>
//         )}

//         {currentSession?.messages.map((msg, index) => (
//           <Box key={msg.id}>
//             {msg.type === "user" ? (
//               <MessageBubble
//                 message={msg}
//                 onSaveSnippet={onSaveSnippet}
//                 onCodeSelect={onCodeSelect}
//               />
//             ) : (
//               <Box sx={{ display: "flex", gap: 1, mb: 2, maxWidth: "100%" }}>
//                 <Avatar
//                   sx={{
//                     bgcolor: "primary.main",
//                     width: 32,
//                     height: 32,
//                     mt: 0.5,
//                   }}
//                 >
//                   <BotIcon sx={{ fontSize: 18 }} />
//                 </Avatar>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     flex: 1,
//                     maxWidth: "100%",
//                     overflow: "hidden",
//                     bgcolor: "grey.50",
//                     border: "1px solid",
//                     borderColor: "divider",
//                     borderRadius: 2,
//                   }}
//                 >
//                   {msg.data ? (
//                     <>
//                       {msg.data.type === "guidance" &&
//                         renderGuidanceResponse(msg.data.response)}
//                       {msg.data.type === "code" &&
//                         renderCodeResponse(msg.data.response)}
//                       {msg.data.type === "vision" &&
//                         renderVisionResponse(msg.data.response)}
//                     </>
//                   ) : (
//                     <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
//                       {msg.content}
//                     </Typography>
//                   )}
//                 </Paper>
//               </Box>
//             )}
//           </Box>
//         ))}

//         {isLoading && (
//           <Box
//             sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, mb: 2 }}
//           >
//             <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
//               <BotIcon sx={{ fontSize: 18 }} />
//             </Avatar>
//             <Box>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <CircularProgress size={16} />
//                 <Typography variant="body2" color="text.secondary">
//                   {processingStage || "Processing..."}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         )}

//         <div ref={messagesEndRef} />
//       </Box>

//       {error && (
//         <Box sx={{ p: 2, pt: 0 }}>
//           <Alert
//             severity="error"
//             onClose={() => setError(null)}
//             sx={{ borderRadius: 2 }}
//           >
//             {error}
//           </Alert>
//         </Box>
//       )}

//       {imagePreview && (
//         <Box sx={{ p: 2, pt: 0 }}>
//           <Paper
//             sx={{
//               p: 2,
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//               bgcolor: "grey.50",
//               border: "1px solid",
//               borderColor: "primary.main",
//               borderRadius: 2,
//             }}
//           >
//             <Box
//               component="img"
//               src={imagePreview}
//               alt="Upload preview"
//               sx={{
//                 width: 60,
//                 height: 60,
//                 objectFit: "cover",
//                 borderRadius: 1,
//               }}
//             />
//             <Box sx={{ flex: 1 }}>
//               <Typography variant="body2" fontWeight="medium">
//                 {uploadedImage?.name}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Ready to analyze •{" "}
//                 {Math.round((uploadedImage?.size || 0) / 1024)} KB
//               </Typography>
//             </Box>
//             <IconButton
//               size="small"
//               onClick={removeImage}
//               sx={{ color: "text.secondary" }}
//             >
//               ×
//             </IconButton>
//           </Paper>
//         </Box>
//       )}

//       <Box
//         sx={{
//           p: 2,
//           borderTop: 1,
//           borderColor: "divider",
//           backgroundColor: "background.paper",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             gap: 1,
//             alignItems: "flex-end",
//             maxWidth: "100%",
//           }}
//         >
//           <IconButton
//             onClick={(e) => setQuickMenuAnchor(e.currentTarget)}
//             disabled={isLoading}
//             sx={{
//               color: "text.secondary",
//               "&:hover": { color: "primary.main" },
//             }}
//           >
//             <ExpandMoreIcon />
//           </IconButton>

//           <IconButton
//             onClick={() => fileInputRef.current?.click()}
//             disabled={isLoading}
//             sx={{
//               color: "text.secondary",
//               "&:hover": { color: "primary.main" },
//             }}
//           >
//             <ImageIcon />
//           </IconButton>

//           <TextField
//             fullWidth
//             multiline
//             maxRows={4}
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Ask for coding guidance, generate components, or upload UI designs..."
//             disabled={isLoading}
//             sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//           />

//           <IconButton
//             onClick={handleSendMessage}
//             disabled={(!message.trim() && !uploadedImage) || isLoading}
//             sx={{
//               bgcolor: "primary.main",
//               color: "white",
//               "&:hover": { bgcolor: "primary.dark" },
//               "&:disabled": { bgcolor: "grey.300", color: "grey.500" },
//             }}
//           >
//             <SendIcon />
//           </IconButton>
//         </Box>

//         <Typography
//           variant="caption"
//           color="text.secondary"
//           sx={{ display: "block", mt: 1, textAlign: "center" }}
//         >
//           Ask for guidance • Generate code • Upload images • Press Enter to send
//         </Typography>
//       </Box>

//       <Menu
//         anchorEl={quickMenuAnchor}
//         open={Boolean(quickMenuAnchor)}
//         onClose={() => setQuickMenuAnchor(null)}
//         PaperProps={{ sx: { maxWidth: 280, mt: 1 } }}
//       >
//         {quickPrompts.map((prompt, index) => (
//           <MenuItem
//             key={index}
//             onClick={() => handleQuickPrompt(prompt)}
//             sx={{ whiteSpace: "normal", py: 1.5 }}
//           >
//             <Typography variant="body2">{prompt}</Typography>
//           </MenuItem>
//         ))}
//       </Menu>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileSelect}
//         style={{ display: "none" }}
//       />
//     </Box>
//   );
// }

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
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
  Divider,
  Button,
  Collapse,
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
  ExpandMore,
  ChevronRight,
  ContentCopy,
  PlayArrow,
  Visibility,
} from "@mui/icons-material";
import { ChatSession, Message, SavedSnippet } from "@/lib/types";
import { apiClient, validateImageFile } from "@/lib/utils";
import MessageBubble from "./MessageBubble";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatPanelProps {
  currentSession: ChatSession | null;
  onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
  onCodeSelect: (code: string, language: string) => void;
}

const quickPrompts = [
  "Explain React hooks for beginners",
  "Create a responsive navbar component",
  "How to become a frontend developer in 2024?",
  "Build a login form with validation",
  "What is JavaScript closure?",
  "Generate a dashboard layout component",
];

export default function ChatPanel({
  currentSession,
  onAddMessage,
  onSaveSnippet,
  onCodeSelect,
}: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [processingStage, setProcessingStage] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Generate unique ID for code blocks
  const generateCodeId = () =>
    `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleCopyCode = async (code: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(codeId);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

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

  const handleSendMessage = async () => {
    if (!message.trim() && !uploadedImage) return;

    const userMessage = message.trim();
    const hasImage = !!uploadedImage;
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

      if (requestType === "vision" && uploadedImage) {
        setProcessingStage("Analyzing image...");
        const visionResponse = await apiClient.analyzeImage(
          uploadedImage,
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
        const codeResponse = await apiClient.generateCode({
          prompt: userMessage,
          language: "typescript",
          framework: "react",
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

  // Code Block Component with Copy and Run functionality
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
    const codeId = useRef(generateCodeId()).current;
    const isCopied = copiedCodeId === codeId;

    return (
      <Box sx={{ position: "relative", mb: 2 }}>
        {/* Code Header */}
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
              <Tooltip title={isCopied ? "Copied!" : "Copy code"}>
                <IconButton
                  size="small"
                  onClick={() => handleCopyCode(code, codeId)}
                  sx={{ color: "white", "&:hover": { bgcolor: "grey.700" } }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Code Content */}
        <SyntaxHighlighter
          language={language}
          // style={vscDarkPlus}
          customStyle={{
            borderRadius: filename || onRunCode ? "0 0 8px 8px" : 8,
            fontSize: "0.85em",
            margin: 0,
          }}
          showLineNumbers={showLineNumbers}
        >
          {code}
        </SyntaxHighlighter>

        {/* Copy Button for code blocks without header */}
        {!filename && !onRunCode && (
          <Tooltip title={isCopied ? "Copied!" : "Copy code"}>
            <IconButton
              size="small"
              onClick={() => handleCopyCode(code, codeId)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "grey.900",
                color: "white",
                "&:hover": { bgcolor: "grey.700" },
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  // Render Guidance Response
  const renderGuidanceResponse = (response: any) => {
    const content = response.content;
    return (
      <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
        {/* Header */}
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

        {/* Prerequisites */}
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

        {/* Learning Objectives */}
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

        {/* Step-by-Step Guide */}
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

        {/* Complete Example */}
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

        {/* Best Practices */}
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

        {/* Next Steps */}
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

  // Render Code Response
  const renderCodeResponse = (response: any) => {
    return (
      <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
        {/* Header */}
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

        {/* Main Code */}
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

        {/* Features */}
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

        {/* Usage */}
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

        {/* Dependencies */}
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

        {/* Best Practices */}
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

  // Render Vision Response
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

        {/* UI Elements */}
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

        {/* Implementation Steps */}
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
      {/* Messages Area */}
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
            <Box>
              <Typography
                variant="h4"
                color="text.primary"
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
              >
                {quickPrompts.slice(0, 3).map((prompt, index) => (
                  <Chip
                    key={index}
                    label={prompt}
                    onClick={() => setMessage(prompt)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "primary.50" },
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
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
                <CircularProgress size={16} />
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
            onClick={(e) => setQuickMenuAnchor(e.currentTarget)}
            disabled={isLoading}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <ExpandMoreIcon />
          </IconButton>

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
          Ask for guidance • Generate code • Upload images • Press Enter to send
        </Typography>
      </Box>

      <Menu
        anchorEl={quickMenuAnchor}
        open={Boolean(quickMenuAnchor)}
        onClose={() => setQuickMenuAnchor(null)}
        PaperProps={{ sx: { maxWidth: 280, mt: 1 } }}
      >
        {quickPrompts.map((prompt, index) => (
          <MenuItem
            key={index}
            onClick={() => handleQuickPrompt(prompt)}
            sx={{ whiteSpace: "normal", py: 1.5 }}
          >
            <Typography variant="body2">{prompt}</Typography>
          </MenuItem>
        ))}
      </Menu>

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

/* last chages undo pervisou8 */
