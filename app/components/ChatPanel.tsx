// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   IconButton,
//   Button,
//   Typography,
//   Paper,
//   Avatar,
//   Chip,
//   Menu,
//   MenuItem,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import {
//   Send as SendIcon,
//   Image as ImageIcon,
//   SmartToy as BotIcon,
//   Person as PersonIcon,
//   ExpandMore as ExpandMoreIcon,
// } from "@mui/icons-material";
// import { ChatSession, Message, SavedSnippet } from "@/lib/types";
// import MessageBubble from "./MessageBubble";
// import ImageUpload from "./Imageupload";

// interface ChatPanelProps {
//   currentSession: ChatSession | null;
//   onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
//   onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
//   onCodeSelect: (code: string, language: string) => void;
// }

// const quickPrompts = [
//   "Analyze this landing page design",
//   "Break down this dashboard layout",
//   "Suggest components for this form",
//   "Convert to mobile-first design",
//   "Generate folder structure",
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
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
//     null
//   );

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [currentSession?.messages]);

//   const handleSendMessage = async () => {
//     if (!message.trim() && !uploadedImage) return;

//     const userMessage: Omit<Message, "id" | "timestamp"> = {
//       type: "user",
//       content: message.trim(),
//       image: uploadedImage || undefined,
//     };

//     onAddMessage(userMessage);
//     setMessage("");
//     setUploadedImage(null);
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Simulate AI response
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       const aiResponse: Omit<Message, "id" | "timestamp"> = {
//         type: "assistant",
//         content: generateMockResponse(message, !!uploadedImage),
//         guidance: uploadedImage ? generateMockGuidance() : undefined,
//       };

//       onAddMessage(aiResponse);
//     } catch (err) {
//       setError("Failed to get AI response. Please try again.");
//       console.error("AI response error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = (imageData: string) => {
//     setUploadedImage(imageData);
//   };

//   const handleQuickPrompt = (prompt: string) => {
//     setMessage(prompt);
//     setQuickMenuAnchor(null);
//   };

//   const generateMockResponse = (
//     userMessage: string,
//     hasImage: boolean
//   ): string => {
//     if (hasImage) {
//       return `I can see you've uploaded a UI design. Let me analyze it and provide detailed guidance for implementation.

// **Analysis Complete!**

// I can see this appears to be a dashboard interface with the following key elements:
// - Navigation sidebar on the left
// - Main content area with cards and charts
// - Header with user controls

// I'll break this down into actionable components and provide implementation guidance.`;
//     }

//     if (userMessage.toLowerCase().includes("landing")) {
//       return `For a landing page design, I recommend focusing on these key components:

// 1. **Hero Section** - Main value proposition
// 2. **Features Section** - Product benefits
// 3. **CTA Sections** - Clear call-to-action buttons
// 4. **Footer** - Links and contact info

// Would you like me to provide specific code snippets for any of these components?`;
//     }

//     return `I understand you're looking for frontend development guidance. To provide the most helpful response, could you:

// 1. Share a screenshot or design mockup
// 2. Specify your target framework (React, Next.js, Vue)
// 3. Let me know your complexity preferences

// I can then provide detailed component breakdowns, code snippets, and implementation guidance!`;
//   };

//   const generateMockGuidance = () => ({
//     pageType: "Dashboard",
//     folderStructure: [
//       "components/",
//       "├── layout/",
//       "├── dashboard/",
//       "├── common/",
//       "pages/",
//       "styles/",
//       "utils/",
//     ],
//     components: [
//       {
//         name: "Sidebar",
//         count: 1,
//         description: "Navigation sidebar with menu items",
//         props: ["items", "isCollapsed", "onItemClick"],
//       },
//       {
//         name: "DashboardCard",
//         count: 4,
//         description: "Reusable card component for metrics",
//         props: ["title", "value", "trend", "icon"],
//       },
//       {
//         name: "ChartWidget",
//         count: 2,
//         description: "Chart visualization component",
//         props: ["data", "type", "height"],
//       },
//     ],
//     complexity: {
//       level: "medium" as const,
//       estimatedHours: 12,
//       factors: [
//         "Multiple data visualizations",
//         "Responsive layout",
//         "State management",
//       ],
//     },
//     snippets: [
//       {
//         id: "1",
//         name: "Sidebar Component",
//         framework: "React + MUI",
//         code: `const Sidebar = ({ items, isCollapsed, onItemClick }) => (
//   <Paper sx={{ width: isCollapsed ? 60 : 240, height: '100vh' }}>
//     <List>
//       {items.map(item => (
//         <ListItem key={item.id} onClick={() => onItemClick(item)}>
//           <ListItemIcon>{item.icon}</ListItemIcon>
//           {!isCollapsed && <ListItemText primary={item.label} />}
//         </ListItem>
//       ))}
//     </List>
//   </Paper>
// )`,
//       },
//     ],
//     styling: {
//       muiProps: {
//         Paper: { elevation: 2, sx: { borderRadius: 2 } },
//         Typography: { variant: "h6", color: "primary" },
//       },
//       tailwindAlternatives: ["shadow-md", "rounded-lg", "bg-white"],
//       responsive: { xs: 12, md: 8, lg: 6 },
//     },
//     accessibility: [
//       "Add aria-labels to interactive elements",
//       "Ensure keyboard navigation support",
//       "Maintain sufficient color contrast",
//     ],
//   });

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
//           p: 2,
//         }}
//         className="chat-scrollbar"
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
//               gap: 2,
//             }}
//           >
//             <BotIcon
//               sx={{ fontSize: 64, color: "primary.main", opacity: 0.5 }}
//             />
//             <Typography variant="h5" color="text.secondary" gutterBottom>
//               Welcome to AI Frontend Helper
//             </Typography>
//             <Typography
//               variant="body1"
//               color="text.secondary"
//               sx={{ maxWidth: 400 }}
//             >
//               Upload a screenshot or design mockup to get detailed component
//               breakdowns, code snippets, and implementation guidance.
//             </Typography>
//           </Box>
//         )}

//         {currentSession?.messages.map((msg, index) => (
//           <MessageBubble
//             key={msg.id}
//             message={msg}
//             onSaveSnippet={onSaveSnippet}
//             onCodeSelect={onCodeSelect}
//           />
//         ))}

//         {isLoading && (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
//             <Avatar sx={{ bgcolor: "secondary.main" }}>
//               <BotIcon />
//             </Avatar>
//             <Paper sx={{ p: 2, flex: 1 }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <CircularProgress size={16} />
//                 <Typography variant="body2" color="text.secondary">
//                   Analyzing and generating response...
//                 </Typography>
//               </Box>
//             </Paper>
//           </Box>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ my: 2 }} onClose={() => setError(null)}>
//             {error}
//           </Alert>
//         )}

//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Input Area */}
//       <Paper
//         elevation={3}
//         sx={{
//           p: 2,
//           backgroundColor: "background.paper",
//           borderTop: 1,
//           borderColor: "divider",
//         }}
//       >
//         {uploadedImage && (
//           <Box sx={{ mb: 2 }}>
//             <Paper sx={{ p: 1, display: "inline-block" }}>
//               <img
//                 src={uploadedImage}
//                 alt="Uploaded"
//                 style={{
//                   maxHeight: 100,
//                   maxWidth: 200,
//                   borderRadius: 4,
//                 }}
//               />
//               <IconButton
//                 size="small"
//                 onClick={() => setUploadedImage(null)}
//                 sx={{ ml: 1 }}
//               >
//                 ×
//               </IconButton>
//             </Paper>
//           </Box>
//         )}

//         <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
//           <TextField
//             fullWidth
//             multiline
//             maxRows={3}
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Describe your UI or ask for help..."
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//             disabled={isLoading}
//           />

//           <input
//             type="file"
//             ref={fileInputRef}
//             style={{ display: "none" }}
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (event) => {
//                   handleImageUpload(event.target?.result as string);
//                 };
//                 reader.readAsDataURL(file);
//               }
//             }}
//           />

//           <IconButton
//             onClick={() => fileInputRef.current?.click()}
//             disabled={isLoading}
//             color="primary"
//           >
//             <ImageIcon />
//           </IconButton>

//           <Button
//             variant="text"
//             endIcon={<ExpandMoreIcon />}
//             onClick={(e) => setQuickMenuAnchor(e.currentTarget)}
//             disabled={isLoading}
//             sx={{ minWidth: "auto", px: 1 }}
//           >
//             Quick
//           </Button>

//           <IconButton
//             onClick={handleSendMessage}
//             disabled={isLoading || (!message.trim() && !uploadedImage)}
//             color="primary"
//             sx={{
//               bgcolor: "primary.main",
//               color: "white",
//               "&:hover": { bgcolor: "primary.dark" },
//               "&:disabled": { bgcolor: "action.disabled" },
//             }}
//           >
//             <SendIcon />
//           </IconButton>
//         </Box>

//         <Menu
//           anchorEl={quickMenuAnchor}
//           open={Boolean(quickMenuAnchor)}
//           onClose={() => setQuickMenuAnchor(null)}
//         >
//           {quickPrompts.map((prompt) => (
//             <MenuItem key={prompt} onClick={() => handleQuickPrompt(prompt)}>
//               {prompt}
//             </MenuItem>
//           ))}
//         </Menu>
//       </Paper>
//     </Box>
//   );
// }

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Paper,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Send as SendIcon,
  Image as ImageIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  ChatSession,
  Message,
  SavedSnippet,
  GuidanceResponse,
} from "@/lib/types";
import MessageBubble from "./MessageBubble";

interface ChatPanelProps {
  currentSession: ChatSession | null;
  onAddMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
  onCodeSelect: (code: string, language: string) => void;
}

const quickPrompts = [
  "Analyze this landing page design",
  "Break down this dashboard layout",
  "Suggest components for this form",
  "Convert to mobile-first design",
  "Generate folder structure",
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() && !uploadedImage) return;

    const userMessage: Omit<Message, "id" | "timestamp"> = {
      type: "user",
      content: message.trim(),
      image: uploadedImage || undefined,
    };

    onAddMessage(userMessage);
    setMessage("");
    setUploadedImage(null);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: Omit<Message, "id" | "timestamp"> = {
        type: "assistant",
        content: generateMockResponse(message, !!uploadedImage),
        guidance: uploadedImage ? generateMockGuidance() : undefined,
      };

      onAddMessage(aiResponse);
    } catch (err) {
      setError("Failed to get AI response. Please try again.");
      console.error("AI response error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    setQuickMenuAnchor(null);
  };

  const generateMockResponse = (
    userMessage: string,
    hasImage: boolean
  ): string => {
    if (hasImage) {
      return `I can see you've uploaded a UI design. Let me analyze it and provide detailed guidance for implementation.

**Analysis Complete!**`;
    }

    if (userMessage.toLowerCase().includes("landing")) {
      return `For a landing page design, I recommend focusing on these key components:

1. Hero Section
2. Features Section
3. CTA Sections
4. Footer`;
    }

    return `I understand you're looking for frontend development guidance. Please provide more details or a screenshot for analysis.`;
  };

  // ✅ Fixed: Only plain JSON data, no functions
  const generateMockGuidance = (): GuidanceResponse => ({
    pageType: "Dashboard",
    folderStructure: [
      "components/",
      "├── layout/",
      "├── dashboard/",
      "├── common/",
      "pages/",
      "styles/",
      "utils/",
    ],
    components: [
      {
        name: "Sidebar",
        count: 1,
        description: "Navigation sidebar with menu items",
        props: ["items", "isCollapsed", "onItemClick"],
      },
      {
        name: "DashboardCard",
        count: 4,
        description: "Reusable card component for metrics",
        props: ["title", "value", "trend", "icon"],
      },
    ],
    complexity: {
      level: "medium",
      estimatedHours: 12,
      factors: [
        "Multiple data visualizations",
        "Responsive layout",
        "State management",
      ],
    },
    snippets: [
      {
        id: "1",
        name: "Sidebar Component",
        framework: "React + MUI",
        code: `const Sidebar = ({ items, isCollapsed, onItemClick }) => (...)`,
      },
    ],
    styling: {
      muiProps: {
        Paper: { elevation: 2, sx: { borderRadius: 2 } },
        Typography: { variant: "h6", color: "primary" },
      },
      tailwindAlternatives: ["shadow-md", "rounded-lg", "bg-white"],
      responsive: { xs: 12, md: 8, lg: 6 },
    },
    accessibility: [
      "Add aria-labels to interactive elements",
      "Ensure keyboard navigation support",
      "Maintain sufficient color contrast",
    ],
  });

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
          p: 2,
        }}
        className="chat-scrollbar"
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
              gap: 2,
            }}
          >
            <BotIcon
              sx={{ fontSize: 64, color: "primary.main", opacity: 0.5 }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Welcome to AI Frontend Helper
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              Upload a screenshot or design mockup to get guidance.
            </Typography>
          </Box>
        )}

        {currentSession?.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onSaveSnippet={onSaveSnippet}
            onCodeSelect={onCodeSelect}
          />
        ))}

        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <BotIcon />
            </Avatar>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing and generating response...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        {uploadedImage && (
          <Box sx={{ mb: 2 }}>
            <Paper sx={{ p: 1, display: "inline-block" }}>
              <img
                src={uploadedImage}
                alt="Uploaded"
                style={{
                  maxHeight: 100,
                  maxWidth: 200,
                  borderRadius: 4,
                }}
              />
              <IconButton
                size="small"
                onClick={() => setUploadedImage(null)}
                sx={{ ml: 1 }}
              >
                ×
              </IconButton>
            </Paper>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your UI or ask for help..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setUploadedImage(event.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            color="primary"
          >
            <ImageIcon />
          </IconButton>

          <Button
            variant="text"
            endIcon={<ExpandMoreIcon />}
            onClick={(e) => setQuickMenuAnchor(e.currentTarget)}
            disabled={isLoading}
            sx={{ minWidth: "auto", px: 1 }}
          >
            Quick
          </Button>

          <IconButton
            onClick={handleSendMessage}
            disabled={isLoading || (!message.trim() && !uploadedImage)}
            color="primary"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              "&:disabled": { bgcolor: "action.disabled" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        <Menu
          anchorEl={quickMenuAnchor}
          open={Boolean(quickMenuAnchor)}
          onClose={() => setQuickMenuAnchor(null)}
        >
          {quickPrompts.map((prompt) => (
            <MenuItem key={prompt} onClick={() => handleQuickPrompt(prompt)}>
              {prompt}
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </Box>
  );
}
