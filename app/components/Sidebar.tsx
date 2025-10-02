"use client";

import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Code as CodeIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { ChatSession, SavedSnippet } from "@/lib/types";

interface SidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  savedSnippets: SavedSnippet[];
  onSelectSession: (session: ChatSession) => void;
  onNewSession: () => void;
  onCodeSelect: (code: string, language: string) => void;
  onDeleteSnippet: (snippetId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function Sidebar({
  sessions,
  currentSession,
  savedSnippets,
  onSelectSession,
  onCodeSelect,
  onDeleteSnippet,
  onDeleteSession,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    sessionId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSessionId(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSessionId) {
      onDeleteSession(selectedSessionId);
      setDeleteDialogOpen(false);
      setSelectedSessionId(null);
      setSuccessMessage(true);
    }
  };
  const handleCloseSuccess = () => {
    setSuccessMessage(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedSessionId(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontSize: "0.875rem",
            },
          }}
        >
          <Tab icon={<ChatIcon fontSize="small" />} label="Chats" />
          <Tab icon={<CodeIcon fontSize="small" />} label="Snippets" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {activeTab === 0 && (
          <Box
            sx={{ height: "100%", overflow: "auto" }}
            className="chat-scrollbar"
          >
            <List dense sx={{ p: 1 }}>
              {sessions.map((session) => (
                <ListItem key={session.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={currentSession?.id === session.id}
                    onClick={() => onSelectSession(session)}
                    sx={{
                      borderRadius: 1,
                      "&.Mui-selected": {
                        backgroundColor: "primary.50",
                        borderLeft: 3,
                        borderLeftColor: "primary.main",
                      },
                    }}
                  >
                    <ListItemText
                      primary={session.title}
                      secondary={formatDate(session.createdAt)}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight:
                          currentSession?.id === session.id ? 600 : 400,
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{ ml: 1, p: 0.25 }}
                      aria-label="more options"
                      onClick={(e) => handleMenuOpen(e, session.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}

              {sessions.length === 0 && (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No chat sessions yet.
                    <br />
                    Start a new conversation!
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        )}

        {activeTab === 1 && (
          <Box
            sx={{ height: "100%", overflow: "auto" }}
            className="chat-scrollbar"
          >
            <List dense sx={{ p: 1 }}>
              {savedSnippets.map((snippet) => (
                <ListItem key={snippet.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() =>
                      onCodeSelect(snippet.code, snippet.framework)
                    }
                    sx={{
                      borderRadius: 1,
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ mb: 0.5 }}
                          noWrap
                        >
                          {snippet.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, mb: 0.5 }}>
                          <Chip
                            label={snippet.framework}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.65rem", height: 18 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(snippet.savedAt)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        sx={{ ml: 1, p: 0.25 }}
                        aria-label="delete snippet"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSnippet(snippet.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}

              {savedSnippets.length === 0 && (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No saved snippets yet.
                    <br />
                    Save code from chat messages!
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Chat Session?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this chat session? This action
            cannot be undone and all messages will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Chat session deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
