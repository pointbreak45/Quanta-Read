"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadFile } from "@/lib/actions";

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    if (!file.type.includes('pdf')) {
      alert('Please upload a PDF file only.');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadFile(formData);
      
      if (result.error) {
        // Handle specific error cases with more user-friendly messages
        let userMessage = result.error;
        if (result.error.includes('already exists') || result.error.includes('Duplicate')) {
          userMessage = `"${file.name}" has already been uploaded. You can find it in your library.`;
        } else if (result.error.includes('storage')) {
          userMessage = 'Storage error. Please try again or contact support.';
        } else if (result.error.includes('network') || result.error.includes('fetch')) {
          userMessage = 'Network error. Please check your connection and try again.';
        } else if (result.error.includes('Database constraint error')) {
          userMessage = 'Database setup required. Please contact administrator.';
        } else if (result.error.includes('PDF parsing')) {
          userMessage = `"${file.name}" was uploaded but PDF text extraction is temporarily limited. The document is still searchable.`;
        }
        alert(`Upload failed: ${userMessage}`);
      } else {
        // Enhanced success message with fallback status
        let message;
        if (result.data?.isExisting) {
          message = `"${file.name}" was already in your library and is ready to use!`;
        } else {
          const embeddingStatus = (result.data as any)?.embeddingStatus;
          if (embeddingStatus === 'fallback') {
            message = `"${file.name}" uploaded successfully! Note: Using local text processing due to AI service connectivity.`;
          } else {
            message = `"${file.name}" has been uploaded successfully!`;
          }
        }
        alert(message);
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? "border-teal-500 bg-teal-500/10" : "border-muted-foreground/30 hover:border-teal-500/50"}`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf"
        onChange={(e) => handleUpload(e.target.files)}
        disabled={isUploading}
      />
      <label htmlFor="file-upload" className={`flex flex-col items-center text-center ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <UploadCloud className={`w-10 h-10 mb-2 ${isUploading ? 'text-teal-500 animate-pulse' : 'text-muted-foreground'}`} />
        <p className="text-sm text-muted-foreground">
          {isUploading ? (
            <span className="font-semibold text-teal-500">Uploading...</span>
          ) : (
            <><span className="font-semibold text-teal-500">Click to upload</span> or drag and drop</>
          )}
        </p>
        <p className="text-xs text-muted-foreground">{isUploading ? 'Please wait...' : 'PDF only (up to 10MB)'}</p>
      </label>
    </div>
  );
}