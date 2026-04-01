"use client";

import React, { useState, useRef } from "react";
import { Icons } from "@/utils/icon";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Workspace {
  id: string;
  name: string;
}

interface UploadDocumentProps {
  workspaces: Workspace[];
}

const UploadDocument = ({ workspaces }: UploadDocumentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState("");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [useNewWorkspace, setUseNewWorkspace] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedWorkspaceName("");
    setNewWorkspaceName("");
    setUseNewWorkspace(false);
    setError(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasValidWorkspace = useNewWorkspace
    ? newWorkspaceName.trim().length > 0
    : selectedWorkspaceName.length > 0;

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".pdf", ".txt", ".md"].includes(ext)) {
      setError("Only .pdf, .txt, and .md files are supported");
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!hasValidWorkspace) {
      setError(useNewWorkspace ? "Please enter a workspace name" : "Please select a workspace");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append("file", selectedFile);
      payload.append(
        "workspaceName",
        useNewWorkspace ? newWorkspaceName.trim() : selectedWorkspaceName,
      );

      await axios.post("/api/document/upload", payload);
      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch(error: any) {
        console.error("Upload error:", error);
      setError("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
      >
        {Icons.upload({ size: 18 })}
        <span className="text-sm font-medium">Upload File</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setIsOpen(false); resetForm(); }}
          />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Upload Document
              </h2>
              <button
                onClick={() => { setIsOpen(false); resetForm(); }}
                className="text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {Icons.close({ size: 20 })}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Workspace selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-foreground">
                    Workspace <span className="text-danger">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUseNewWorkspace((prev) => !prev);
                      setSelectedWorkspaceName("");
                      setNewWorkspaceName("");
                    }}
                    className="text-xs text-primary hover:text-primary-hover font-medium cursor-pointer transition-colors"
                  >
                    {useNewWorkspace ? "Choose existing" : "Create new"}
                  </button>
                </div>

                {useNewWorkspace ? (
                  <input
                    type="text"
                    placeholder="e.g. My New Workspace"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input-border bg-input-bg text-input-text placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition"
                  />
                ) : (
                  <select
                    value={selectedWorkspaceName}
                    onChange={(e) => setSelectedWorkspaceName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input-border bg-input-bg text-input-text focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition appearance-none cursor-pointer"
                  >
                    <option value="">Select a workspace</option>
                    {workspaces.map((ws) => (
                      <option key={ws.id} value={ws.name}>
                        {ws.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* File drop zone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  File <span className="text-danger">*</span>
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : selectedFile
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-surface-hover"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  />
                  {selectedFile ? (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        {Icons.document({ size: 20 })}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate max-w-full">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-muted">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-muted-light/20 flex items-center justify-center">
                        {Icons.upload({ size: 20, className: "text-muted" })}
                      </div>
                      <span className="text-sm text-muted">
                        Drop a file here or click to browse
                      </span>
                      <span className="text-xs text-muted-light">
                        .pdf, .txt, .md
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setIsOpen(false); resetForm(); }}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-surface-hover transition-colors cursor-pointer text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !hasValidWorkspace}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-text rounded-lg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isUploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadDocument;
