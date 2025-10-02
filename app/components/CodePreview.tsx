"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Toolbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  Code as CodeIcon,
  Visibility as PreviewIcon,
  PlayArrow as RunIcon,
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
  shouldAutoRunPreview?: boolean;
  onPreviewRun?: () => void;
  onClose?: () => void;
}

// const languageOptions = [
//   { value: "typescript", label: "TypeScript" },
//   { value: "javascript", label: "JavaScript" },
//   { value: "tsx", label: "React TSX" },
//   { value: "jsx", label: "React JSX" },
//   { value: "html", label: "HTML" },
//   { value: "css", label: "CSS" },
// ];

export default function CodePreview({
  code,
  language,
  onSaveSnippet,
  className,
  shouldAutoRunPreview = false,
  onPreviewRun,
  onClose,
}: CodePreviewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentCode, setCurrentCode] = useState(code);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [previewContent, setPreviewContent] = useState("");

  // Auto-run preview when code changes or shouldAutoRunPreview is true
  useEffect(() => {
    if (code) {
      setCurrentCode(code);
      setCurrentLanguage(language);

      if (shouldAutoRunPreview) {
        generatePreview(code, language);
        setActiveTab(1); // Switch to preview tab automatically
        if (onPreviewRun) {
          onPreviewRun();
        }
      }
    }
  }, [code, language, shouldAutoRunPreview, onPreviewRun]);

  const transformReactToHTML = (reactCode: string): string => {
    try {
      let jsxContent = reactCode;

      // Extract JSX from component
      const componentMatch = reactCode.match(
        /(?:export\s+default\s+)?(?:function|const)\s+\w+[^{]*{([\s\S]*?)(?:return\s*\(([\s\S]*?)\);?\s*}|return\s+([\s\S]*?);?\s*})/
      );
      if (componentMatch) {
        jsxContent =
          componentMatch[2] || componentMatch[3] || componentMatch[1];
      }

      // Clean up React-specific syntax
      jsxContent = jsxContent
        .replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, "")
        .replace(/export\s+default\s+.*?;?\n?/g, "")
        .replace(/className=/g, "class=")
        .replace(/{\/\*[\s\S]*?\*\/}/g, "")
        .replace(/\/\/.*$/gm, "");

      // Convert inline styles
      jsxContent = jsxContent.replace(/style={{([^}]+)}}/g, (match, styles) => {
        try {
          const styleStr = styles
            .split(",")
            .map((s: string) => {
              const parts = s.split(":");
              if (parts.length < 2) return "";
              const key = parts[0].trim().replace(/['"]/g, "");
              const value = parts
                .slice(1)
                .join(":")
                .trim()
                .replace(/['"]/g, "");
              const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
              return `${cssKey}:${value}`;
            })
            .filter(Boolean)
            .join(";");
          return `style="${styleStr}"`;
        } catch {
          return "";
        }
      });

      // Handle JSX expressions - convert {variable} to actual text or remove
      jsxContent = jsxContent.replace(/{([^}]+)}/g, (match, content) => {
        // If it's a string literal, extract it
        if (content.match(/^['"`]/)) {
          return content.replace(/^['"`]|['"`]$/g, "");
        }
        // For other expressions, try to preserve meaningful content
        return content.includes('"') || content.includes("'")
          ? content.replace(/['"]/g, "")
          : "";
      });

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              background: #ffffff;
              padding: 20px;
            }
            img { 
              max-width: 100%; 
              height: auto; 
              display: block; 
            }
            button {
              cursor: pointer;
              border: 1px solid #ddd;
              padding: 10px 20px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              background: #fff;
              transition: all 0.2s;
            }
            button:hover {
              background: #f5f5f5;
              border-color: #999;
            }
            input, textarea, select {
              font-family: inherit;
              font-size: 14px;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              width: 100%;
              transition: border-color 0.2s;
            }
            input:focus, textarea:focus, select:focus {
              outline: none;
              border-color: #4f46e5;
              box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            a {
              color: #4f46e5;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-bottom: 0.5em;
              font-weight: 600;
            }
            p {
              margin-bottom: 1em;
            }
            ul, ol {
              margin-left: 1.5em;
              margin-bottom: 1em;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          ${jsxContent}
          
          <script>
            // Add basic interactivity
            document.querySelectorAll('button').forEach(button => {
              if (!button.onclick) {
                button.onclick = function() {
                  console.log('Button clicked:', this.textContent);
                };
              }
            });
          </script>
        </body>
        </html>
      `;
    } catch (error) {
      console.error("Transform error:", error);
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: system-ui; 
              padding: 40px; 
              text-align: center;
              background: #fef2f2;
              color: #dc2626;
            }
            h2 { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h2>Unable to render preview</h2>
          <p>There was an error transforming the code. Please check the syntax.</p>
        </body>
        </html>
      `;
    }
  };

  const generatePreview = (codeToPreview: string, lang: string) => {
    try {
      if (lang === "html") {
        // For HTML, ensure it's a complete document
        if (!codeToPreview.toLowerCase().includes("<!doctype")) {
          setPreviewContent(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
            </head>
            <body>
              ${codeToPreview}
            </body>
            </html>
          `);
        } else {
          setPreviewContent(codeToPreview);
        }
      } else if (["jsx", "tsx"].includes(lang)) {
        const transformedCode = transformReactToHTML(codeToPreview);
        setPreviewContent(transformedCode);
      } else if (["javascript", "typescript"].includes(lang)) {
        const jsPreview = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>JavaScript Preview</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                background: #f9fafb;
              }
              #root {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script>
              try {
                ${codeToPreview}
              } catch (error) {
                document.getElementById('root').innerHTML = 
                  '<div style="color: #dc2626; padding: 20px;"><strong>Error:</strong> ' + 
                  error.message + '</div>';
              }
            </script>
          </body>
          </html>
        `;
        setPreviewContent(jsPreview);
      } else if (lang === "css") {
        const cssPreview = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CSS Preview</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                background: #f9fafb;
              }
              ${codeToPreview}
            </style>
          </head>
          <body>
            <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <p>This is a paragraph with some <strong>bold text</strong> and <em>italic text</em>.</p>
              <p>Another paragraph with a <a href="#">link</a>.</p>
              <button>Button</button>
              <input type="text" placeholder="Input field" style="margin-top: 10px;" />
              <ul style="margin-top: 10px;">
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
              </ul>
            </div>
          </body>
          </html>
        `;
        setPreviewContent(cssPreview);
      } else {
        setPreviewContent(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: system-ui; 
                padding: 40px; 
                text-align: center;
                background: #fef3c7;
                color: #92400e;
              }
            </style>
          </head>
          <body>
            <h2>Preview Not Available</h2>
            <p>Live preview is not supported for ${lang} files.</p>
          </body>
          </html>
        `);
      }
    } catch (error) {
      console.error("Preview generation error:", error);
      setPreviewContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: system-ui; 
              padding: 40px; 
              text-align: center;
              background: #fef2f2;
              color: #dc2626;
            }
          </style>
        </head>
        <body>
          <h2>Preview Error</h2>
          <p>Unable to generate preview. Please check your code syntax.</p>
        </body>
        </html>
      `);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleDownload = () => {
    const extension = getFileExtension(currentLanguage);
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `component.${extension}`;
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

  const handleRunPreview = () => {
    generatePreview(currentCode, currentLanguage);
    setActiveTab(1);
  };

  const getFileExtension = (lang: string): string => {
    const extensions: { [key: string]: string } = {
      typescript: "ts",
      javascript: "js",
      tsx: "tsx",
      jsx: "jsx",
      html: "html",
      css: "css",
    };
    return extensions[lang.toLowerCase()] || "txt";
  };

  const editorHeight = isFullscreen ? "80vh" : isMobile ? "300px" : "500px";

  const editorContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: isFullscreen ? "80vh" : "400px",
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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}
        >
          {onClose && (
            <IconButton size="small" onClick={onClose} title="Close preview">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}
      >
        <Tab icon={<CodeIcon />} label="Code" iconPosition="start" />
        <Tab icon={<PreviewIcon />} label="Preview" iconPosition="start" />
      </Tabs>

      <Box sx={{ flexGrow: 1, minHeight: editorHeight }}>
        {activeTab === 0 ? (
          <MonacoEditor
            height={editorHeight}
            language={
              currentLanguage === "tsx" ? "typescript" : currentLanguage
            }
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
              tabSize: 2,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        ) : (
          <Box
            sx={{
              height: editorHeight,
              overflow: "auto",
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {previewContent ? (
              <iframe
                srcDoc={previewContent}
                title="Live Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  flexGrow: 1,
                }}
                sandbox="allow-scripts allow-forms allow-modals"
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 2,
                  p: 3,
                  textAlign: "center",
                  bgcolor: "#f9fafb",
                }}
              >
                <PreviewIcon sx={{ fontSize: 64, color: "grey.400" }} />
                <Typography variant="h6" color="text.secondary">
                  Preview Ready
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click the Run button to see the live preview
                </Typography>
                {/* <Button
                  variant="contained"
                  startIcon={<RunIcon />}
                  onClick={handleRunPreview}
                  sx={{ mt: 2 }}
                >
                  Run Preview
                </Button> */}
              </Box>
            )}
          </Box>
        )}
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
        minHeight: "450px",
      }}
      className={className}
    >
      {editorContent}

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
          {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Language:{" "}
            {
              languageOptions.find((opt) => opt.value === currentLanguage)
                ?.label
            }
          </Typography> */}
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
