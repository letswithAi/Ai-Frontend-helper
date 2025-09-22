"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface ImageUploadProps {
  onImageAnalyzed: (analysis: ImageAnalysisResult) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

interface ImageAnalysisResult {
  ocr: {
    text: string;
    confidence: number;
  };
  vision: {
    description: string;
    confidence: number;
  };
  merged: string;
  imageUrl: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function ImageUpload({
  onImageAnalyzed,
  onError,
  disabled = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file validation
  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Unsupported file type. Please use: ${ACCEPTED_TYPES.map(
        (t) => t.split("/")[1]
      ).join(", ")}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  }, []);

  // Create preview URL
  const createPreview = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return url;
  }, []);

  // Clean up preview URL
  const cleanupPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  // Process uploaded file
  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        onError(validationError);
        return;
      }

      setSelectedFile(file);
      const imageUrl = createPreview(file);
      setUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("image", file);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const response = await fetch("/api/vision", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Analysis failed");
        }

        // Add image URL to result
        const analysisResult: ImageAnalysisResult = {
          ...result,
          imageUrl,
        };

        onImageAnalyzed(analysisResult);

        // Reset progress after a delay
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (error) {
        console.error("Upload error:", error);
        onError(error instanceof Error ? error.message : "Upload failed");
        cleanupPreview();
        setSelectedFile(null);
      } finally {
        setUploading(false);
      }
    },
    [validateFile, createPreview, cleanupPreview, onImageAnalyzed, onError]
  );

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || uploading) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [disabled, uploading, processFile]
  );

  // Handle file input change
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  // Handle click to upload
  const handleClick = useCallback(() => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  }, [disabled, uploading]);

  // Handle remove file
  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    cleanupPreview();
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [cleanupPreview]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
      {/* Upload Area */}
      <Paper
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          p: 4,
          textAlign: "center",
          cursor: disabled || uploading ? "not-allowed" : "pointer",
          border: "2px dashed",
          borderColor: dragActive
            ? "primary.main"
            : selectedFile
            ? "success.main"
            : "grey.300",
          bgcolor: dragActive
            ? "primary.50"
            : selectedFile
            ? "success.50"
            : "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: disabled || uploading ? "grey.300" : "primary.main",
            bgcolor: disabled || uploading ? "background.paper" : "primary.50",
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={disabled || uploading}
        />

        {uploading ? (
          <Box>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Analyzing image...
            </Typography>
            {uploadProgress > 0 && (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mt: 2, width: "100%" }}
              />
            )}
          </Box>
        ) : selectedFile ? (
          <Box>
            <ImageIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              File Selected
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedFile.name}
            </Typography>
            <Chip
              label={formatFileSize(selectedFile.size)}
              size="small"
              sx={{ mb: 2 }}
            />
            {previewUrl && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 8,
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
            <Button
              startIcon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              color="error"
              variant="outlined"
              size="small"
            >
              Remove
            </Button>
          </Box>
        ) : (
          <Box>
            <UploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Upload UI Screenshot
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Drag & drop an image here, or click to select
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports: PNG, JPG, JPEG, WebP (max 10MB)
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Quick Action Buttons */}
      {!selectedFile && !uploading && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleClick}
            disabled={disabled}
          >
            Browse Files
          </Button>
        </Box>
      )}

      {/* Help Text */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Tips:</strong> For best results, use high-contrast images with
          clear text. Screenshots from Figma, design tools, or websites work
          great!
        </Typography>
      </Alert>
    </Box>
  );
}
