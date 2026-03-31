"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import Toolbar from "./Toolbar";

interface DocumentTiptapProps {
  initialContent?: string;
  documentId: string;
  isEditable: boolean;
  onContentChange?: (html: string) => void;
}

const DocumentTiptap = ({
  initialContent,
  documentId,
  isEditable,
  onContentChange,
}: DocumentTiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: !isEditable,
        HTMLAttributes: { class: "tiptap-link" },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: initialContent || "",
    editable: isEditable,
    immediatelyRender: false,
    onUpdate: ({ editor, transaction }) => {
      if (transaction.docChanged) {
        onContentChange?.(editor.getHTML());
    }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor h-full flex flex-col">
      {isEditable && <Toolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="flex-1"
      />
    </div>
  );
};

export default DocumentTiptap;
