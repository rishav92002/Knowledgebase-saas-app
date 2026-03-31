"use client";

import React from "react";
import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor;
}

interface ButtonDef {
  label: string;
  action: () => void;
  isActiveKey: () => boolean;
  icon: string;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      highlight: e.isActive("highlight"),
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      taskList: e.isActive("taskList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      alignLeft: e.isActive({ textAlign: "left" }),
      alignCenter: e.isActive({ textAlign: "center" }),
      alignRight: e.isActive({ textAlign: "right" }),
      link: e.isActive("link"),
    }),
  });

  const groups: ButtonDef[][] = [
    [
      {
        label: "Bold (Ctrl+B)",
        action: () => editor.chain().focus().toggleBold().run(),
        isActiveKey: () => editorState.bold,
        icon: "B",
      },
      {
        label: "Italic (Ctrl+I)",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActiveKey: () => editorState.italic,
        icon: "I",
      },
      {
        label: "Underline (Ctrl+U)",
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActiveKey: () => editorState.underline,
        icon: "U",
      },
      {
        label: "Strikethrough",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActiveKey: () => editorState.strike,
        icon: "S",
      },
      {
        label: "Highlight",
        action: () => editor.chain().focus().toggleHighlight().run(),
        isActiveKey: () => editorState.highlight,
        icon: "H",
      },
    ],
    [
      {
        label: "Heading 1",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActiveKey: () => editorState.h1,
        icon: "H1",
      },
      {
        label: "Heading 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActiveKey: () => editorState.h2,
        icon: "H2",
      },
      {
        label: "Heading 3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActiveKey: () => editorState.h3,
        icon: "H3",
      },
    ],
    [
      {
        label: "Bullet List",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActiveKey: () => editorState.bulletList,
        icon: "•",
      },
      {
        label: "Ordered List",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActiveKey: () => editorState.orderedList,
        icon: "1.",
      },
      {
        label: "Task List",
        action: () => editor.chain().focus().toggleTaskList().run(),
        isActiveKey: () => editorState.taskList,
        icon: "☑",
      },
    ],
    [
      {
        label: "Blockquote",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActiveKey: () => editorState.blockquote,
        icon: "❝",
      },
      {
        label: "Code Block",
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        isActiveKey: () => editorState.codeBlock,
        icon: "</>",
      },
      {
        label: "Horizontal Rule",
        action: () => editor.chain().focus().setHorizontalRule().run(),
        isActiveKey: () => false,
        icon: "—",
      },
    ],
    [
      {
        label: "Align Left",
        action: () => editor.chain().focus().setTextAlign("left").run(),
        isActiveKey: () => editorState.alignLeft,
        icon: "≡L",
      },
      {
        label: "Align Center",
        action: () => editor.chain().focus().setTextAlign("center").run(),
        isActiveKey: () => editorState.alignCenter,
        icon: "≡C",
      },
      {
        label: "Align Right",
        action: () => editor.chain().focus().setTextAlign("right").run(),
        isActiveKey: () => editorState.alignRight,
        icon: "≡R",
      },
    ],
    [
      {
        label: "Link",
        action: () => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        },
        isActiveKey: () => editorState.link,
        icon: "🔗",
      },
    ],
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border border-border rounded-xl mb-3">
      {groups.map((group, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 && <div className="w-px h-6 bg-border mx-1" />}
          {group.map((btn) => {
            const active = btn.isActiveKey();
            return (
              <div key={btn.label} className="relative group/tooltip">
                <button
                  onClick={btn.action}
                  className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-primary text-primary-text"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  {btn.icon}
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-20">
                  {btn.label}
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Toolbar;
