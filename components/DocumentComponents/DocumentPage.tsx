"use client";

import React, { useState, useRef } from "react";
import DocumentTiptap from "./DocumentTiptap";
import { Icons } from "@/utils/icon";
import axios from "axios";
import { is } from "zod/v4/locales";


interface DocumentData {
  id: string;
  name: string;
  title: string | null;
  content: string | null;
}
 
interface DocumentPageProps {
  documentData: DocumentData;
}

const DocumentPage = ({ documentData }: DocumentPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [savingStatus, setSavingStatus] = useState<"saving..." | "saved" | "error saving"|"">("");

  const isEmpty = !documentData.content || documentData.content === "<p></p>" || documentData.content.trim() === "";
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleContentChange = async (html: string) => {
  if(debounceTimeoutRef.current){
    clearTimeout(debounceTimeoutRef.current);
  }
  debounceTimeoutRef.current = setTimeout(async () => { 
    try{
      setSavingStatus("saving...");
      const payload = {
        content: html,
        name: documentData.name,
        title: documentData.title,
      }
      await axios.patch("/api/document", payload, { headers: { documentId: documentData.id } });
      setSavingStatus("saved");
    }catch(error){
      setSavingStatus("error saving");
    }
  }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Document header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">
            {documentData.name} {isEditing && <span className="text-sm font-normal text-muted"> {savingStatus}</span>}
          </h1>
        </div>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            isEditing
              ? "bg-success/15 text-success hover:bg-success/25"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {isEditing ? Icons.chevronRight({ size: 16 }) : Icons.edit({ size: 16 })}
          {isEditing ? "Done Editing" : "Edit Document"}
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {isEmpty && !isEditing ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-14 h-14 rounded-full bg-muted-light/20 flex items-center justify-center mb-4">
              {Icons.document({ size: 28, className: "text-muted-light" })}
            </div>
            <p className="text-lg font-medium text-muted">Document is empty</p>
            <p className="text-sm text-muted-light mt-1">
              Click <span className="font-semibold text-primary">Edit Document</span> to start adding content
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-6 min-h-full">
            <DocumentTiptap
              initialContent={documentData.content || ""}
              documentId={documentData.id}
              isEditable={isEditing}
              onContentChange={handleContentChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPage;
