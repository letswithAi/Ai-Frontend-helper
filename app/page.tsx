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

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [codePreviewOpen, setCodePreviewOpen] = useState(!isMobile);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
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
    const newSession: ChatSession = {
      id: generateUuid(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: generateUuid(),
      timestamp: new Date(),
    };

    if (!currentSession) {
      createNewSession();
      return;
    }

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMessage],
      title:
        currentSession.messages.length === 0
          ? message.content.length > 30
            ? message.content.substring(0, 30) + "..."
            : message.content
          : currentSession.title,
    };

    setCurrentSession(updatedSession);
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
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

  const handleCodeSelect = (code: string, language: string = "typescript") => {
    setSelectedCode(code);
    setSelectedLanguage(language);
    if (isMobile) {
      setCodePreviewOpen(true);
    }
  };

  // Initialize with a session if none exists
  useEffect(() => {
    if (sessions.length === 0 && !currentSession) {
      createNewSession();
    }
  }, []);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleCodePreview={() => setCodePreviewOpen(!codePreviewOpen)}
        onNewChat={createNewSession}
      />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Mobile Sidebar Drawer */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 280,
                boxSizing: "border-box",
              },
            }}
          >
            <Sidebar
              sessions={sessions}
              currentSession={currentSession}
              savedSnippets={savedSnippets}
              onSelectSession={selectSession}
              onNewSession={createNewSession}
              onCodeSelect={handleCodeSelect}
            />
          </Drawer>
        ) : (
          // Desktop Sidebar
          sidebarOpen && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <Sidebar
                sessions={sessions}
                currentSession={currentSession}
                savedSnippets={savedSnippets}
                onSelectSession={selectSession}
                onNewSession={createNewSession}
                onCodeSelect={handleCodeSelect}
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
          />
        </Box>

        {/* Code Preview Panel */}
        {isMobile ? (
          <Drawer
            anchor="right"
            open={codePreviewOpen}
            onClose={() => setCodePreviewOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: "90%",
                boxSizing: "border-box",
              },
            }}
          >
            <CodePreview
              code={selectedCode}
              language={selectedLanguage}
              onSaveSnippet={saveSnippet}
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
              />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}
