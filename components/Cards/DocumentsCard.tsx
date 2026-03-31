"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icons } from "@/utils/icon";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DocumentsCardProps {
  id: string;
  name: string;
  title: string;
  content?: string;
  workspaceId: string;
  workspaceName?: string;
  updatedAt: Date;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function truncateContent(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

const DocumentCard = ({
  id,
  name,
  title,
  content,
  workspaceId,
  workspaceName,
  updatedAt,
}: DocumentsCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isRenaming, setIsRenaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDelete = async () => {
    try {
      await axios.delete("/api/document", {
        headers: { documentId: id },
      });
      router.refresh();
    } catch {
      setError("Failed to delete document");
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName.trim() === name) {
      setRenameOpen(false);
      setNewName(name);
      return;
    }
    setIsRenaming(true);
    try {
      await axios.patch("/api/document", { name: newName.trim() }, {
        headers: { documentId: id },
      });
      setRenameOpen(false);
      router.refresh();
    } catch {
      setError("Failed to rename document");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="w-full bg-card-bg border border-card-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {Icons.document({ size: 20 })}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate" title={name}>
                {name}
              </h3>
              </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="text-muted hover:text-foreground hover:bg-surface-hover p-1.5 rounded-lg cursor-pointer transition-colors"
            >
              {Icons.moreVertical({ size: 18, className: "fill-current" })}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 w-36 bg-surface border border-border rounded-xl shadow-lg p-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setNewName(name);
                    setRenameOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-surface-hover transition-colors cursor-pointer text-sm"
                >
                  {Icons.edit({ size: 15 })}
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    handleDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-danger hover:bg-surface-hover transition-colors cursor-pointer text-sm"
                >
                  {Icons.trash({ size: 15 })}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-light">
            {workspaceName && (
              <div className="flex items-center gap-1.5">
                {Icons.folder({ size: 14 })}
                <span className="truncate max-w-[120px]" title={workspaceName}>
                  {workspaceName}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              {Icons.recent({ size: 14 })}
              <span>{timeAgo(updatedAt)}</span>
            </div>
          </div>

          <Link
            href={`/dashboard/documents/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-hover hover:bg-primary hover:text-white text-foreground px-3 py-1 rounded-lg text-xs font-semibold transition-all"
          >
            Open
          </Link>
        </div>
      </div>

      {/* Rename modal */}
      {renameOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setRenameOpen(false);
              setNewName(name);
              setError(null);
            }}
          />
          <div className="relative w-full max-w-sm bg-surface border border-border rounded-xl shadow-xl p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Rename Document
            </h3>

            {error && (
              <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
                {error}
              </div>
            )}

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setRenameOpen(false);
                  setNewName(name);
                }
              }}
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-input-text placeholder-input-placeholder text-sm focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setRenameOpen(false);
                  setNewName(name);
                  setError(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-surface-hover transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={isRenaming || newName.trim().length === 0}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-text hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isRenaming ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
