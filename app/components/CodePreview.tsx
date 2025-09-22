"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Toolbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { SavedSnippet } from "@/lib/types";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 300,
        bgcolor: "grey.100",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Typography color="text.secondary">Loading editor...</Typography>
    </Box>
  ),
});

interface CodePreviewProps {
  code: string;
  language: string;
  onSaveSnippet: (snippet: Omit<SavedSnippet, "id" | "savedAt">) => void;
  className?: string;
}

const languageOptions = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "tsx", label: "React TSX" },
  { value: "jsx", label: "React JSX" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "yaml", label: "YAML" },
];

export default function CodePreview({
  code,
  language,
  onSaveSnippet,
  className,
}: CodePreviewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentCode, setCurrentCode] = useState(code);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  React.useEffect(() => {
    setCurrentCode(code);
    setCurrentLanguage(language);
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentCode;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownload = () => {
    const extension = getFileExtension(currentLanguage);
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snippet.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (snippetName.trim()) {
      onSaveSnippet({
        name: snippetName.trim(),
        code: currentCode,
        framework: currentLanguage,
      });
      setSaveDialogOpen(false);
      setSnippetName("");
    }
  };

  const getFileExtension = (lang: string) => {
    switch (lang) {
      case "typescript":
        return "ts";
      case "javascript":
        return "js";
      case "tsx":
        return "tsx";
      case "jsx":
        return "jsx";
      case "html":
        return "html";
      case "css":
        return "css";
      case "scss":
        return "scss";
      case "json":
        return "json";
      case "markdown":
        return "md";
      case "yaml":
        return "yml";
      default:
        return "txt";
    }
  };

  const editorHeight = isFullscreen ? "80vh" : isMobile ? "300px" : "400px";

  const editorContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: isFullscreen ? "80vh" : "350px",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          gap: 1,
          minHeight: "48px !important",
          bgcolor: "background.paper",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontSize: "1rem",
            minWidth: isMobile ? "100%" : "auto",
            mb: isMobile ? 0.5 : 0,
          }}
        >
          Code Preview
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              displayEmpty
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            size="small"
            onClick={handleCopy}
            title="Copy code"
            color={copySuccess ? "success" : "default"}
          >
            <CopyIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setSaveDialogOpen(true)}
            title="Save snippet"
          >
            <SaveIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleDownload}
            title="Download file"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <CloseIcon fontSize="small" />
            ) : (
              <FullscreenIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Toolbar>

      <Box sx={{ flexGrow: 1, minHeight: editorHeight }}>
        <MonacoEditor
          height={editorHeight}
          language={currentLanguage === "tsx" ? "typescript" : currentLanguage}
          value={currentCode}
          onChange={(value) => setCurrentCode(value || "")}
          theme={theme.palette.mode === "dark" ? "vs-dark" : "vs"}
          options={{
            readOnly: false,
            minimap: { enabled: !isMobile },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            fontSize: isMobile ? 12 : 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
            },
          }}
        />
      </Box>
    </Box>
  );

  if (isFullscreen) {
    return (
      <Dialog
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: "95vw",
            height: "90vh",
            maxWidth: "none",
            maxHeight: "none",
          },
        }}
      >
        {editorContent}
      </Dialog>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "350px",
      }}
      className={className}
    >
      {editorContent}

      {/* Save Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Code Snippet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Snippet Name"
            fullWidth
            variant="outlined"
            value={snippetName}
            onChange={(e) => setSnippetName(e.target.value)}
            placeholder="Enter a name for this snippet"
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Language:{" "}
            {
              languageOptions.find((opt) => opt.value === currentLanguage)
                ?.label
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!snippetName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Feedback */}
      {copySuccess && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            bgcolor: "success.main",
            color: "success.contrastText",
            px: 2,
            py: 1,
            borderRadius: 1,
            zIndex: 9999,
          }}
        >
          <Typography variant="body2">Code copied to clipboard!</Typography>
        </Box>
      )}
    </Paper>
  );
}
