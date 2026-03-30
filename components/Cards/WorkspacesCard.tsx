"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icons } from "@/utils/icon";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WorkspacesCardProps {
  id: string;
  name: string;
  documentCount: number;
  updatedAt: Date;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

interface errorProps {
    message?:string,
    
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

const WorkspacesCard = ({
  id,
  name,
  documentCount,
  updatedAt,
  onEdit,
  onDelete,
  onClick,
}: WorkspacesCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isRenaming, setIsRenaming] = useState(false);
  const [error, setError] = useState<errorProps>({});
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
      await axios.delete("/api/workflow", {
        headers: { workspaceId: id },
      });
      router.refresh();
    } catch {
      setError({ message: "Failed to delete workspace" });
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
      await axios.patch("/api/workflow", { name: newName.trim() }, {
        headers: { workspaceId: id },
      });
      setRenameOpen(false);
      router.refresh();
    } catch {
      setError({ message: "Failed to rename workspace" });
    } finally {
      setIsRenaming(false);
    }
  };
  return (
    
    <div
      className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group w-56"
      onClick={() => onClick?.(id)}
    >
      {/* Gradient banner */}
      <div className="h-28 bg-gradient-to-br from-primary to-blue-700 relative p-4 flex items-end">
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-lg cursor-pointer transition-colors"
          >
            {Icons.moreVertical({ size: 18, className: "fill-current" })}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-36 bg-surface border border-border rounded-xl shadow-lg p-1 z-10">
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
                  handleDelete?.();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-danger hover:bg-surface-hover transition-colors cursor-pointer text-sm"
              >
                {Icons.trash({ size: 15 })}
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Icon overlapping banner and body */}
        <div className="w-12 h-12 rounded-lg bg-card-bg shadow-lg flex items-center justify-center text-primary translate-y-6 border border-card-border">
          {Icons.folder({ size: 24 })}
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 pt-8 min-w-0">
        <h3 className="text-lg font-bold text-foreground truncate" title={name}>{name}</h3>

        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-muted text-sm">
            {Icons.document({ size: 16 })}
            <span>
              {documentCount} {documentCount === 1 ? "document" : "documents"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted text-sm">
            {Icons.recent({ size: 16 })}
            <span>Updated {timeAgo(updatedAt)}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <Link
            href={`/dashboard/workspaces/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-hover hover:bg-primary hover:text-white text-foreground px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
          >
            Open
          </Link>
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(id);
            }}
            className="bg-surface-hover hover:bg-primary hover:text-white text-foreground px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          >
            Open
          </button> */}
        </div>
      </div>

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
              setError({});
            }}
          />
          <div className="relative w-full max-w-sm bg-surface border border-border rounded-xl shadow-xl p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Rename Workspace
            </h3>

            {error?.message && (
              <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
                {error.message}
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
                  setError({});
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

export default WorkspacesCard;