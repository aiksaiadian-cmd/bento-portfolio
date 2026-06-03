"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useModeStore } from "@/store/modeStore";
import { usePageStore } from "@/store/pageStore";
import { useState, useCallback } from "react";
import type { BentoBlock, BentoPageContent } from "@/types";

interface Props {
  block: BentoBlock;
  pageId: string;
}

export function TextBlock({ block, pageId }: Props) {
  const mode = useModeStore((s) => s.mode);
  const updatePage = usePageStore((s) => s.updatePage);
  const page = usePageStore((s) => s.pages.find((p) => p.id === pageId));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: true,
      }),
      Placeholder.configure({
        placeholder: "Напишите текст...",
      }),
    ],
    content: (block.content as { html: string }).html || "",
    editable: mode === "edit",
    onUpdate: ({ editor }) => {
      if (!page || page.type !== "bento") return;
      const content = page.content as BentoPageContent;
      updatePage(pageId, {
        content: {
          ...content,
          blocks: {
            ...content.blocks,
            [block.id]: {
              ...block,
              content: { html: editor.getHTML() },
            },
          },
        } as BentoPageContent,
      });
    },
  });

  // Update editable state when mode changes
  const [prevMode, setPrevMode] = useState(mode);
  if (mode !== prevMode && editor) {
    editor.setEditable(mode === "edit");
    setPrevMode(mode);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Minimal toolbar — only in edit mode */}
      {mode === "edit" && editor && (
        <div className="flex items-center gap-0.5 px-2 py-1 bg-zinc-50 border-b border-zinc-100">
          <ToolbarBtn
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            label="B"
            style={{ fontWeight: 700 }}
          />
          <ToolbarBtn
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            label="I"
            style={{ fontStyle: "italic" }}
          />
          <span className="w-px h-4 bg-zinc-200 mx-1" />
          <ToolbarBtn
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            label="H2"
          />
          <ToolbarBtn
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            label="H3"
          />
          <span className="w-px h-4 bg-zinc-200 mx-1" />
          <ToolbarBtn
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            label="• List"
          />
          <ToolbarBtn
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            label="1. List"
          />
          <span className="w-px h-4 bg-zinc-200 mx-1" />
          <button
            onClick={() => {
              const url = prompt("Link URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className="px-1.5 py-0.5 rounded text-xs text-zinc-600 hover:bg-zinc-200"
          >
            🔗
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto tiptap">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarBtn({
  active,
  onClick,
  label,
  style,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-zinc-600 hover:bg-zinc-200"
      }`}
      style={style}
    >
      {label}
    </button>
  );
}
