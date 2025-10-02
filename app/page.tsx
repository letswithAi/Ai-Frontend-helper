// "use client";

// import React, { useState, useEffect } from "react";
// import { Box, Grid, useMediaQuery, useTheme, Drawer } from "@mui/material";
// import Header from "../app/components/Header";
// import ChatPanel from "../app/components/ChatPanel";
// import Sidebar from "../app/components/Sidebar";
// import CodePreview from "../app/components/CodePreview";
// import { Message, ChatSession, SavedSnippet } from "@/lib/types";
// import { v4 as uuidv4 } from "uuid";

// function generateUuid(): string {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// export default function HomePage() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
//   const [shouldAutoRunPreview, setShouldAutoRunPreview] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [codePreviewOpen, setCodePreviewOpen] = useState(false);
//   const [currentSession, setCurrentSession] = useState<ChatSession | null>(
//     null
//   );
//   const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
//   const [selectedCode, setSelectedCode] = useState<string>("");
//   const [selectedLanguage, setSelectedLanguage] =
//     useState<string>("typescript");

//   // Load data from localStorage
//   useEffect(() => {
//     const savedSessions = localStorage.getItem("chat-sessions");
//     const savedSnippetsData = localStorage.getItem("saved-snippets");

//     if (savedSessions) {
//       try {
//         const parsedSessions = JSON.parse(savedSessions).map(
//           (session: any) => ({
//             ...session,
//             createdAt: new Date(session.createdAt),
//             messages: session.messages.map((msg: any) => ({
//               ...msg,
//               timestamp: new Date(msg.timestamp),
//             })),
//           })
//         );
//         setSessions(parsedSessions);
//         if (parsedSessions.length > 0) {
//           setCurrentSession(parsedSessions[0]);
//         }
//       } catch (e) {
//         console.error("Error loading sessions:", e);
//       }
//     }

//     if (savedSnippetsData) {
//       try {
//         const parsedSnippets = JSON.parse(savedSnippetsData).map(
//           (snippet: any) => ({
//             ...snippet,
//             savedAt: new Date(snippet.savedAt),
//           })
//         );
//         setSavedSnippets(parsedSnippets);
//       } catch (e) {
//         console.error("Error loading snippets:", e);
//       }
//     }
//   }, []);

//   // Save sessions to localStorage
//   useEffect(() => {
//     if (sessions.length > 0) {
//       localStorage.setItem("chat-sessions", JSON.stringify(sessions));
//     }
//   }, [sessions]);

//   // Save snippets to localStorage
//   useEffect(() => {
//     if (savedSnippets.length > 0) {
//       localStorage.setItem("saved-snippets", JSON.stringify(savedSnippets));
//     }
//   }, [savedSnippets]);

//   const createNewSession = () => {
//     // Don't create session here, just clear current session
//     // Session will be created when user sends first message
//     setCurrentSession(null);
//   };

//   const selectSession = (session: ChatSession) => {
//     setCurrentSession(session);
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   };

//   const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
//     const newMessage: Message = {
//       ...message,
//       id: generateUuid(),
//       timestamp: new Date(),
//     };

//     if (!currentSession) {
//       const newSession: ChatSession = {
//         id: generateUuid(),
//         title:
//           message.content.length > 30
//             ? message.content.substring(0, 30) + "..."
//             : message.content,
//         messages: [newMessage],
//         createdAt: new Date(),
//       };
//       setSessions((prev) => [newSession, ...prev]);
//       setCurrentSession(newSession);
//       return;
//     }

//     const updatedSession = {
//       ...currentSession,
//       messages: [...currentSession.messages, newMessage],
//       title:
//         currentSession.messages.length === 0 && message.type === "user"
//           ? message.content.length > 30
//             ? message.content.substring(0, 30) + "..."
//             : message.content
//           : currentSession.title,
//     };

//     setCurrentSession(updatedSession);
//     setSessions((prev) =>
//       prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
//     );
//   };

//   const saveSnippet = (snippet: Omit<SavedSnippet, "id" | "savedAt">) => {
//     const newSnippet: SavedSnippet = {
//       ...snippet,
//       id: generateUuid(),
//       savedAt: new Date(),
//     };
//     setSavedSnippets((prev) => [newSnippet, ...prev]);
//   };

//   const handleDeleteSnippet = (snippetId: string) => {
//     setSavedSnippets((prev) =>
//       prev.filter((snippet) => snippet.id !== snippetId)
//     );

//     // Update localStorage
//     const updatedSnippets = savedSnippets.filter(
//       (snippet) => snippet.id !== snippetId
//     );
//     if (updatedSnippets.length > 0) {
//       localStorage.setItem("saved-snippets", JSON.stringify(updatedSnippets));
//     } else {
//       localStorage.removeItem("saved-snippets");
//     }
//   };

//   const handleCopyCode = async (code: string, codeId: string) => {
//     try {
//       await navigator.clipboard.writeText(code);
//       setCopiedCodeId(codeId);
//       setTimeout(() => setCopiedCodeId(null), 2000);
//     } catch (err) {
//       console.error("Failed to copy code:", err);
//     }
//   };

//   const handleCodeSelect = (code: string, language: string = "typescript") => {
//     setSelectedCode(code);
//     setSelectedLanguage(language);
//     setCodePreviewOpen(true);

//     // Small delay to ensure drawer is open before triggering preview
//     setTimeout(
//       () => {
//         setShouldAutoRunPreview(true);
//       },
//       isMobile ? 300 : 0
//     );
//   };

//   // Initialize with a session if none exists
//   // Initialize with a session if none exists
//   useEffect(() => {
//     if (sessions.length === 0 && !currentSession) {
//       // Don't create a session yet, wait for first message
//       setCurrentSession(null);
//     }
//   }, []);
//   const handleDeleteSession = (sessionId: string) => {
//     const updatedSessions = sessions.filter(
//       (session) => session.id !== sessionId
//     );
//     setSessions(updatedSessions);

//     // If deleting current session, switch to another one or create new
//     if (currentSession?.id === sessionId) {
//       if (updatedSessions.length > 0) {
//         setCurrentSession(updatedSessions[0]);
//       } else {
//         createNewSession();
//       }
//     }

//     // Update localStorage
//     if (updatedSessions.length > 0) {
//       localStorage.setItem("chat-sessions", JSON.stringify(updatedSessions));
//     } else {
//       localStorage.removeItem("chat-sessions");
//     }
//   };
//   return (
//     <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
//       <Header
//         onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//         onToggleCodePreview={() => setCodePreviewOpen(!codePreviewOpen)}
//         onNewChat={createNewSession}
//         sidebarOpen={sidebarOpen}
//       />

//       <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
//         {/* Mobile Sidebar Drawer */}
//         {isMobile ? (
//           <Drawer
//             anchor="left"
//             open={sidebarOpen}
//             onClose={() => setSidebarOpen(false)}
//             ModalProps={{
//               keepMounted: true,
//             }}
//             sx={{
//               "& .MuiDrawer-paper": {
//                 width: 280,
//                 boxSizing: "border-box",
//               },
//             }}
//           >
//             <Sidebar
//               sessions={sessions}
//               currentSession={currentSession}
//               savedSnippets={savedSnippets}
//               onSelectSession={selectSession}
//               onNewSession={createNewSession}
//               onCodeSelect={handleCodeSelect}
//               onDeleteSnippet={handleDeleteSnippet}
//               onDeleteSession={handleDeleteSession}
//             />
//           </Drawer>
//         ) : (
//           // Desktop Sidebar
//           sidebarOpen && (
//             <Box sx={{ width: 280, flexShrink: 0 }}>
//               <Sidebar
//                 sessions={sessions}
//                 currentSession={currentSession}
//                 savedSnippets={savedSnippets}
//                 onSelectSession={selectSession}
//                 onNewSession={createNewSession}
//                 onCodeSelect={handleCodeSelect}
//                 onDeleteSnippet={handleDeleteSnippet}
//                 onDeleteSession={handleDeleteSession}
//               />
//             </Box>
//           )
//         )}

//         {/* Main Chat Area */}
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             minWidth: 0,
//           }}
//         >
//           <ChatPanel
//             currentSession={currentSession}
//             onAddMessage={addMessage}
//             onSaveSnippet={saveSnippet}
//             onCodeSelect={handleCodeSelect}
//             copiedCodeId={copiedCodeId}
//             onCopyCode={handleCopyCode}
//           />
//         </Box>

//         {/* Code Preview Panel */}
//         {isMobile ? (
//           <Drawer
//             anchor="right"
//             open={codePreviewOpen}
//             onClose={() => setCodePreviewOpen(false)}
//             ModalProps={{
//               keepMounted: true,
//             }}
//             sx={{
//               "& .MuiDrawer-paper": {
//                 width: "90%",
//                 boxSizing: "border-box",
//               },
//             }}
//           >
//             <CodePreview
//               code={selectedCode}
//               language={selectedLanguage}
//               onSaveSnippet={saveSnippet}
//               shouldAutoRunPreview={shouldAutoRunPreview}
//               onPreviewRun={() => setShouldAutoRunPreview(false)}
//               onClose={() => setCodePreviewOpen(false)}
//             />
//           </Drawer>
//         ) : (
//           codePreviewOpen && (
//             <Box
//               sx={{
//                 width: 400,
//                 flexShrink: 0,
//                 borderLeft: 1,
//                 borderColor: "divider",
//               }}
//             >
//               <CodePreview
//                 code={selectedCode}
//                 language={selectedLanguage}
//                 onSaveSnippet={saveSnippet}
//                 shouldAutoRunPreview={shouldAutoRunPreview}
//                 onPreviewRun={() => setShouldAutoRunPreview(false)}
//                 onClose={() => setCodePreviewOpen(false)}
//               />
//             </Box>
//           )
//         )}
//       </Box>
//     </Box>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Box, Grid, useMediaQuery, useTheme, Drawer } from "@mui/material";
import Header from "../app/components/Header";
import ChatPanel from "../app/components/ChatPanel";
import Sidebar from "../app/components/Sidebar";
import CodePreview from "../app/components/CodePreview";
import { Message, ChatSession, SavedSnippet } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const [shouldAutoRunPreview, setShouldAutoRunPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const currentSessionIdRef = React.useRef<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("typescript");

  // Load data from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("chat-sessions");
    const savedSnippetsData = localStorage.getItem("saved-snippets");

    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map(
          (session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          })
        );
        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
          setCurrentSession(parsedSessions[0]);
        }
      } catch (e) {
        console.error("Error loading sessions:", e);
      }
    }

    if (savedSnippetsData) {
      try {
        const parsedSnippets = JSON.parse(savedSnippetsData).map(
          (snippet: any) => ({
            ...snippet,
            savedAt: new Date(snippet.savedAt),
          })
        );
        setSavedSnippets(parsedSnippets);
      } catch (e) {
        console.error("Error loading snippets:", e);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chat-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Save snippets to localStorage
  useEffect(() => {
    if (savedSnippets.length > 0) {
      localStorage.setItem("saved-snippets", JSON.stringify(savedSnippets));
    }
  }, [savedSnippets]);

  const createNewSession = () => {
    // Don't create session here, just clear current session
    setCurrentSession(null);
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // ✅ FIXED addMessage so user + AI stay in same session
  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: generateUuid(),
      timestamp: new Date(),
    };

    // If no session yet → create and set synchronously
    if (!currentSessionIdRef.current) {
      const newSessionId = generateUuid();
      const newSession: ChatSession = {
        id: newSessionId,
        title:
          newMessage.type === "user"
            ? newMessage.content.length > 30
              ? newMessage.content.substring(0, 30) + "..."
              : newMessage.content
            : "New Chat",
        messages: [newMessage],
        createdAt: new Date(),
      };

      currentSessionIdRef.current = newSessionId; // ✅ store immediately
      setCurrentSession(newSession);
      setSessions((prev) => [newSession, ...prev]);
      return;
    }

    // Otherwise append to the existing session by ID
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionIdRef.current
          ? {
              ...s,
              messages: [...s.messages, newMessage],
              title:
                s.messages.length === 0 && newMessage.type === "user"
                  ? newMessage.content.length > 30
                    ? newMessage.content.substring(0, 30) + "..."
                    : newMessage.content
                  : s.title,
            }
          : s
      )
    );

    // also update currentSession for UI
    setCurrentSession((prev) =>
      prev && prev.id === currentSessionIdRef.current
        ? {
            ...prev,
            messages: [...prev.messages, newMessage],
          }
        : prev
    );
  };

  const saveSnippet = (snippet: Omit<SavedSnippet, "id" | "savedAt">) => {
    const newSnippet: SavedSnippet = {
      ...snippet,
      id: generateUuid(),
      savedAt: new Date(),
    };
    setSavedSnippets((prev) => [newSnippet, ...prev]);
  };

  const handleDeleteSnippet = (snippetId: string) => {
    setSavedSnippets((prev) =>
      prev.filter((snippet) => snippet.id !== snippetId)
    );

    const updatedSnippets = savedSnippets.filter(
      (snippet) => snippet.id !== snippetId
    );
    if (updatedSnippets.length > 0) {
      localStorage.setItem("saved-snippets", JSON.stringify(updatedSnippets));
    } else {
      localStorage.removeItem("saved-snippets");
    }
  };

  const handleCopyCode = async (code: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(codeId);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCodeSelect = (code: string, language: string = "typescript") => {
    setSelectedCode(code);
    setSelectedLanguage(language);
    setCodePreviewOpen(true);

    setTimeout(
      () => {
        setShouldAutoRunPreview(true);
      },
      isMobile ? 300 : 0
    );
  };

  // Initialize with a session if none exists
  useEffect(() => {
    if (sessions.length === 0 && !currentSession) {
      setCurrentSession(null);
    }
  }, []);

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(
      (session) => session.id !== sessionId
    );
    setSessions(updatedSessions);

    if (currentSession?.id === sessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSession(updatedSessions[0]);
      } else {
        createNewSession();
      }
    }

    if (updatedSessions.length > 0) {
      localStorage.setItem("chat-sessions", JSON.stringify(updatedSessions));
    } else {
      localStorage.removeItem("chat-sessions");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleCodePreview={() => setCodePreviewOpen(!codePreviewOpen)}
        onNewChat={createNewSession}
        sidebarOpen={sidebarOpen}
      />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Mobile Sidebar Drawer */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: 280, boxSizing: "border-box" },
            }}
          >
            <Sidebar
              sessions={sessions}
              currentSession={currentSession}
              savedSnippets={savedSnippets}
              onSelectSession={selectSession}
              onNewSession={createNewSession}
              onCodeSelect={handleCodeSelect}
              onDeleteSnippet={handleDeleteSnippet}
              onDeleteSession={handleDeleteSession}
            />
          </Drawer>
        ) : (
          sidebarOpen && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <Sidebar
                sessions={sessions}
                currentSession={currentSession}
                savedSnippets={savedSnippets}
                onSelectSession={selectSession}
                onNewSession={createNewSession}
                onCodeSelect={handleCodeSelect}
                onDeleteSnippet={handleDeleteSnippet}
                onDeleteSession={handleDeleteSession}
              />
            </Box>
          )
        )}

        {/* Main Chat Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <ChatPanel
            currentSession={currentSession}
            onAddMessage={addMessage}
            onSaveSnippet={saveSnippet}
            onCodeSelect={handleCodeSelect}
            copiedCodeId={copiedCodeId}
            onCopyCode={handleCopyCode}
          />
        </Box>

        {/* Code Preview Panel */}
        {isMobile ? (
          <Drawer
            anchor="right"
            open={codePreviewOpen}
            onClose={() => setCodePreviewOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: "90%", boxSizing: "border-box" },
            }}
          >
            <CodePreview
              code={selectedCode}
              language={selectedLanguage}
              onSaveSnippet={saveSnippet}
              shouldAutoRunPreview={shouldAutoRunPreview}
              onPreviewRun={() => setShouldAutoRunPreview(false)}
              onClose={() => setCodePreviewOpen(false)}
            />
          </Drawer>
        ) : (
          codePreviewOpen && (
            <Box
              sx={{
                width: 400,
                flexShrink: 0,
                borderLeft: 1,
                borderColor: "divider",
              }}
            >
              <CodePreview
                code={selectedCode}
                language={selectedLanguage}
                onSaveSnippet={saveSnippet}
                shouldAutoRunPreview={shouldAutoRunPreview}
                onPreviewRun={() => setShouldAutoRunPreview(false)}
                onClose={() => setCodePreviewOpen(false)}
              />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}
