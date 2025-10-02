"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleCodePreview: () => void;
  onNewChat: () => void;
  sidebarOpen: boolean; // Add this prop
}

export default function Header({
  onToggleSidebar,
  onToggleCodePreview,
  onNewChat,
  sidebarOpen, // Receive the prop
}: HeaderProps) {
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleToggleClick = () => {
    if (sidebarOpen) {
      // Close sidebar
      onToggleSidebar();
    } else {
      // Open sidebar and create new chat
      onToggleSidebar();
      onNewChat();
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: "56px", sm: "64px" },
          px: { xs: 1, sm: 2 },
        }}
      >
        <IconButton
          // edge="start"
          onClick={handleToggleClick}
          size={isMobile ? "medium" : "small"}
          sx={{
            mr: { xs: 2, sm: 1 },
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            width: { xs: 30, sm: 26 },
            height: { xs: 30, sm: 26 },
          }}
          aria-label={sidebarOpen ? "close sidebar" : "new chat"}
        >
          {sidebarOpen ? (
            <CloseIcon fontSize={isMobile ? "medium" : "small"} />
          ) : (
            <AddIcon fontSize={isMobile ? "medium" : "small"} />
          )}
        </IconButton>

        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            background: "linear-gradient(45deg, #2563eb, #7c3aed)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Frontend Helper
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }} />
      </Toolbar>
    </AppBar>
  );
}
