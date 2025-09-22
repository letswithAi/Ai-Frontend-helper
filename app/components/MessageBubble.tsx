// "use client";

// import React from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Avatar,
//   Chip,
//   Button,
//   Divider,
//   IconButton,
//   LinearProgress,
// } from "@mui/material";
// import {
//   Person as PersonIcon,
//   SmartToy as BotIcon,
//   ContentCopy as CopyIcon,
//   Save as SaveIcon,
//   Code as CodeIcon,
// } from "@mui/icons-material";
// import { Message, SavedSnippet, ComponentInfo } from "@/lib/types";

// interface MessageBubbleProps {
//   message: Message;
//   onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
//   onCodeSelect: (code: string, language: string) => void;
// }

// export default function MessageBubble({
//   message,
//   onSaveSnippet,
//   onCodeSelect,
// }: MessageBubbleProps) {
//   const isUser = message.type === "user";

//   const handleCopyCode = async (code: string) => {
//     try {
//       await navigator.clipboard.writeText(code);
//     } catch (err) {
//       console.error("Failed to copy code:", err);
//     }
//   };

//   const handleSaveSnippet = (code: string, name: string, framework: string) => {
//     onSaveSnippet({
//       name,
//       code,
//       framework,
//     });
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const getComplexityColor = (level: string) => {
//     switch (level) {
//       case "simple":
//         return "success";
//       case "medium":
//         return "warning";
//       case "complex":
//         return "error";
//       default:
//         return "primary";
//     }
//   };

//   const getComplexityValue = (level: string) => {
//     switch (level) {
//       case "simple":
//         return 33;
//       case "medium":
//         return 66;
//       case "complex":
//         return 100;
//       default:
//         return 0;
//     }
//   };

//   return (
//     <Box
//       className="message-bubble"
//       sx={{
//         display: "flex",
//         flexDirection: isUser ? "row-reverse" : "row",
//         alignItems: "flex-start",
//         gap: 1,
//         mb: 2,
//       }}
//     >
//       <Avatar
//         sx={{
//           bgcolor: isUser ? "primary.main" : "secondary.main",
//           width: 32,
//           height: 32,
//         }}
//       >
//         {isUser ? (
//           <PersonIcon fontSize="small" />
//         ) : (
//           <BotIcon fontSize="small" />
//         )}
//       </Avatar>

//       <Paper
//         sx={{
//           p: 2,
//           maxWidth: isUser ? "70%" : "85%",
//           bgcolor: isUser ? "primary.50" : "background.paper",
//           borderRadius: 2,
//           position: "relative",
//         }}
//       >
//         {message.image && (
//           <Box sx={{ mb: 2 }}>
//             <img
//               src={message.image}
//               alt="User upload"
//               style={{
//                 maxWidth: "100%",
//                 maxHeight: 200,
//                 borderRadius: 8,
//                 objectFit: "contain",
//               }}
//             />
//           </Box>
//         )}

//         <Typography
//           variant="body1"
//           sx={{
//             whiteSpace: "pre-wrap",
//             wordBreak: "break-word",
//             lineHeight: 1.5,
//           }}
//         >
//           {message.content}
//         </Typography>

//         {message.guidance && (
//           <Box sx={{ mt: 2 }}>
//             <Divider sx={{ mb: 2 }} />

//             {/* Page Type */}
//             <Box sx={{ mb: 2 }}>
//               <Chip
//                 label={`Page Type: ${message.guidance.pageType}`}
//                 color="primary"
//                 variant="outlined"
//                 size="small"
//               />
//             </Box>

//             {/* Complexity Meter */}
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Complexity: {message.guidance.complexity.level} (
//                 {message.guidance.complexity.estimatedHours}h)
//               </Typography>
//               <LinearProgress
//                 variant="determinate"
//                 value={getComplexityValue(message.guidance.complexity.level)}
//                 color={getComplexityColor(message.guidance.complexity.level)}
//                 sx={{ height: 8, borderRadius: 4, mb: 1 }}
//               />
//               <Typography variant="caption" color="text.secondary">
//                 Factors: {message.guidance.complexity.factors.join(", ")}
//               </Typography>
//             </Box>

//             {/* Folder Structure */}
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 📁 Folder Structure
//               </Typography>
//               <Paper sx={{ p: 1, bgcolor: "grey.50" }}>
//                 <Typography
//                   component="pre"
//                   variant="body2"
//                   sx={{
//                     fontFamily: "monospace",
//                     fontSize: "0.75rem",
//                     lineHeight: 1.4,
//                     margin: 0,
//                   }}
//                 >
//                   {message.guidance.folderStructure.join("\n")}
//                 </Typography>
//               </Paper>
//             </Box>

//             {/* Components */}
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 🧩 Components ({message.guidance.components.length})
//               </Typography>
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                 {message.guidance.components.map(
//                   (component: ComponentInfo, index: number) => (
//                     <Chip
//                       key={index}
//                       label={`${component.name} (${component.count})`}
//                       size="small"
//                       variant="outlined"
//                       title={component.description}
//                     />
//                   )
//                 )}
//               </Box>
//             </Box>

//             {/* Code Snippets */}
//             {message.guidance.snippets.length > 0 && (
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="subtitle2" gutterBottom>
//                   💾 Code Snippets
//                 </Typography>
//                 {message.guidance.snippets.map((snippet, index) => (
//                   <Paper
//                     key={index}
//                     sx={{
//                       p: 2,
//                       mb: 2,
//                       bgcolor: "grey.900",
//                       color: "white",
//                       position: "relative",
//                       "&:hover .code-actions": {
//                         opacity: 1,
//                       },
//                     }}
//                   >
//                     <Box
//                       className="code-actions"
//                       sx={{
//                         position: "absolute",
//                         top: 8,
//                         right: 8,
//                         display: "flex",
//                         gap: 0.5,
//                         opacity: 0,
//                         transition: "opacity 0.2s",
//                       }}
//                     >
//                       <IconButton
//                         size="small"
//                         onClick={() => handleCopyCode(snippet.code)}
//                         sx={{ color: "white" }}
//                         title="Copy code"
//                       >
//                         <CopyIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         onClick={() =>
//                           handleSaveSnippet(
//                             snippet.code,
//                             snippet.name,
//                             snippet.framework
//                           )
//                         }
//                         sx={{ color: "white" }}
//                         title="Save snippet"
//                       >
//                         <SaveIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         onClick={() => onCodeSelect(snippet.code, "typescript")}
//                         sx={{ color: "white" }}
//                         title="Open in editor"
//                       >
//                         <CodeIcon fontSize="small" />
//                       </IconButton>
//                     </Box>

//                     <Typography
//                       variant="caption"
//                       sx={{ color: "grey.300", mb: 1, display: "block" }}
//                     >
//                       {snippet.name} - {snippet.framework}
//                     </Typography>

//                     <Typography
//                       component="pre"
//                       variant="body2"
//                       sx={{
//                         fontFamily: "Monaco, Consolas, monospace",
//                         fontSize: "0.75rem",
//                         lineHeight: 1.4,
//                         margin: 0,
//                         overflow: "auto",
//                         whiteSpace: "pre-wrap",
//                         wordBreak: "break-all",
//                       }}
//                     >
//                       {snippet.code}
//                     </Typography>
//                   </Paper>
//                 ))}
//               </Box>
//             )}

//             {/* Styling Recommendations */}
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 🎨 Styling Tips
//               </Typography>
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
//                 {message.guidance.styling.tailwindAlternatives.map(
//                   (className, index) => (
//                     <Chip
//                       key={index}
//                       label={className}
//                       size="small"
//                       sx={{ fontSize: "0.65rem" }}
//                     />
//                   )
//                 )}
//               </Box>
//               <Typography variant="caption" color="text.secondary">
//                 Responsive: xs={message.guidance.styling.responsive.xs} md=
//                 {message.guidance.styling.responsive.md} lg=
//                 {message.guidance.styling.responsive.lg}
//               </Typography>
//             </Box>

//             {/* Accessibility */}
//             <Box>
//               <Typography variant="subtitle2" gutterBottom>
//                 ♿ Accessibility
//               </Typography>
//               <Box component="ul" sx={{ pl: 2, m: 0 }}>
//                 {message.guidance.accessibility.map((item, index) => (
//                   <Typography
//                     key={index}
//                     component="li"
//                     variant="caption"
//                     color="text.secondary"
//                   >
//                     {item}
//                   </Typography>
//                 ))}
//               </Box>
//             </Box>
//           </Box>
//         )}

//         <Typography
//           variant="caption"
//           color="text.secondary"
//           sx={{
//             display: "block",
//             textAlign: isUser ? "right" : "left",
//             mt: 1,
//             opacity: 0.7,
//           }}
//         >
//           {formatTime(message.timestamp)}
//         </Typography>
//       </Paper>
//     </Box>
//   );
// }

"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { Message, SavedSnippet, ComponentInfo } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
  onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
  onCodeSelect: (code: string, language: string) => void;
}

export default function MessageBubble({
  message,
  onSaveSnippet,
  onCodeSelect,
}: MessageBubbleProps) {
  const isUser = message.type === "user";

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleSaveSnippet = (code: string, name: string, framework: string) => {
    onSaveSnippet({
      name,
      code,
      framework,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case "simple":
        return "success";
      case "medium":
        return "warning";
      case "complex":
        return "error";
      default:
        return "primary";
    }
  };

  const getComplexityValue = (level: string) => {
    switch (level) {
      case "simple":
        return 33;
      case "medium":
        return 66;
      case "complex":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Box
      className="message-bubble"
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 1,
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? "primary.main" : "secondary.main",
          width: 32,
          height: 32,
        }}
      >
        {isUser ? (
          <PersonIcon fontSize="small" />
        ) : (
          <BotIcon fontSize="small" />
        )}
      </Avatar>

      <Paper
        sx={{
          p: 2,
          maxWidth: isUser ? "70%" : "85%",
          bgcolor: isUser ? "primary.50" : "background.paper",
          borderRadius: 2,
          position: "relative",
        }}
      >
        {message.image && (
          <Box sx={{ mb: 2 }}>
            <img
              src={message.image}
              alt="User upload"
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                borderRadius: 1,
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </Typography>

        {message.guidance && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />

            {/* Page Type */}
            <Box sx={{ mb: 2 }}>
              <Chip
                label={`Page Type: ${message.guidance.pageType}`}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Complexity Meter */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Complexity: {message.guidance.complexity.level} (
                {message.guidance.complexity.estimatedHours}h)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getComplexityValue(message.guidance.complexity.level)}
                color={getComplexityColor(message.guidance.complexity.level)}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Factors: {message.guidance.complexity.factors.join(", ")}
              </Typography>
            </Box>

            {/* Folder Structure */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                📁 Folder Structure
              </Typography>
              <Paper sx={{ p: 1, bgcolor: "grey.50" }}>
                <Typography
                  component="pre"
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {message.guidance.folderStructure.join("\n")}
                </Typography>
              </Paper>
            </Box>

            {/* Components */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                🧩 Components ({message.guidance.components.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {message.guidance.components.map(
                  (component: ComponentInfo, index: number) => (
                    <Chip
                      key={index}
                      label={`${component.name} (${component.count})`}
                      size="small"
                      variant="outlined"
                      title={component.description}
                    />
                  )
                )}
              </Box>
            </Box>

            {/* Code Snippets */}
            {message.guidance.snippets.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  💾 Code Snippets
                </Typography>
                {message.guidance.snippets.map((snippet, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "grey.900",
                      color: "white",
                      position: "relative",
                      "&:hover .code-actions": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      className="code-actions"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 0.5,
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleCopyCode(snippet.code)}
                        sx={{ color: "white" }}
                        title="Copy code"
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleSaveSnippet(
                            snippet.code,
                            snippet.name,
                            snippet.framework
                          )
                        }
                        sx={{ color: "white" }}
                        title="Save snippet"
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onCodeSelect(snippet.code, "typescript")}
                        sx={{ color: "white" }}
                        title="Open in editor"
                      >
                        <CodeIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{ color: "grey.300", mb: 1, display: "block" }}
                    >
                      {snippet.name} - {snippet.framework}
                    </Typography>

                    <Typography
                      component="pre"
                      variant="body2"
                      sx={{
                        fontFamily: "Monaco, Consolas, monospace",
                        fontSize: "0.75rem",
                        lineHeight: 1.4,
                        margin: 0,
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {snippet.code}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Styling Recommendations */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                🎨 Styling Tips
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                {message.guidance.styling.tailwindAlternatives.map(
                  (className, index) => (
                    <Chip
                      key={index}
                      label={className}
                      size="small"
                      sx={{ fontSize: "0.65rem" }}
                    />
                  )
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Responsive: xs={message.guidance.styling.responsive.xs} md=
                {message.guidance.styling.responsive.md} lg=
                {message.guidance.styling.responsive.lg}
              </Typography>
            </Box>

            {/* Accessibility */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ♿ Accessibility
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {message.guidance.accessibility.map((item, index) => (
                  <Typography
                    key={index}
                    component="li"
                    variant="caption"
                    color="text.secondary"
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: isUser ? "right" : "left",
            mt: 1,
            opacity: 0.7,
          }}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </Paper>
    </Box>
  );
}
