"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useState, useRef } from "react";
import { usePageStore } from "@/store/pageStore";
import { useModeStore } from "@/store/modeStore";
import { fileToBase64, validateFile } from "@/lib/media";
import type { NotionPageContent } from "@/types";

export function NotionEditor() {
  const page = usePageStore((s) => s.getCurrentPage());
  const updatePage = usePageStore((s) => s.updatePage);
  const mode = useModeStore((s) => s.mode);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const slashRef = useRef<HTMLDivElement>(null);

  const pageContent = page?.type === "notion" ? (page.content as NotionPageContent) : null;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: true }),
      ImageExt.configure({ inline: false }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
    ],
    content: pageContent?.html ?? "",
    editable: mode === "edit",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px]",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "/" && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
          const { selection } = view.state;
          const { from } = selection;
          const textBefore = view.state.doc.textBetween(
            Math.max(0, from - 1),
            from
          );
          if (textBefore === "" || textBefore === " " || textBefore === "\n") {
            const coords = view.coordsAtPos(from);
            setSlashPos({ top: coords.top - 100, left: coords.left });
            setSlashOpen(true);
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (!page || page.type !== "notion") return;
      const content = page.content as NotionPageContent;
      const html = ed.getHTML();
      if (content.html !== html) {
        updatePage(page.id, {
          content: {
            ...content,
            html,
          } as NotionPageContent,
        });
      }
    },
  });

  // Restore content when switching pages or after init
  useEffect(() => {
    if (editor && pageContent) {
      const currentHtml = editor.getHTML();
      const savedHtml = pageContent.html ?? "";
      if (currentHtml !== savedHtml) {
        editor.commands.setContent(savedHtml);
      }
    }
  }, [page?.id, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(mode === "edit");
    }
  }, [mode, editor]);

  const insertBlock = useCallback(
    (type: string) => {
      if (!editor) return;
      setSlashOpen(false);
      switch (type) {
        case "heading1": editor.chain().focus().toggleHeading({ level: 1 }).run(); break;
        case "heading2": editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
        case "heading3": editor.chain().focus().toggleHeading({ level: 3 }).run(); break;
        case "bulletList": editor.chain().focus().toggleBulletList().run(); break;
        case "orderedList": editor.chain().focus().toggleOrderedList().run(); break;
        case "quote": editor.chain().focus().toggleBlockquote().run(); break;
        case "divider": editor.chain().focus().setHorizontalRule().run(); break;
        case "code": editor.chain().focus().toggleCodeBlock().run(); break;
      }
      editor.chain().focus().run();
    },
    [editor]
  );

  const handleImageUpload = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const validation = validateFile(file);
      if (!validation.valid) return;
      const base64 = await fileToBase64(file);
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    input.click();
  }, [editor]);

  return (
    <div className="notion-editor relative">
      {mode === "edit" && editor && (
        <div className="flex items-center gap-1 mb-3 pb-3 border-b border-zinc-100 flex-wrap">
          <ToolBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} label="H1" />
          <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" />
          <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3" />
          <span className="w-px h-4 bg-zinc-200 mx-1" />
          <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="B" style={{ fontWeight: 700 }} />
          <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="I" style={{ fontStyle: "italic" }} />
          <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} label="S" style={{ textDecoration: "line-through" }} />
          <ToolBtn active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} label="<>" />
          <span className="w-px h-4 bg-zinc-200 mx-1" />
          <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="• List" />
          <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="1. List" />
          <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} label='" Quote' />
          <ToolBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} label="— Divider" />
          <span className="w-px h-4 bg-zinc-200 mx-1" />
          <button onClick={() => { const url = prompt("Link URL:"); if (url) editor.chain().focus().setLink({ href: url }).run(); }} className="px-2 py-1 rounded text-xs text-zinc-600 hover:bg-zinc-200">🔗</button>
          <button onClick={handleImageUpload} className="px-2 py-1 rounded text-xs text-zinc-600 hover:bg-zinc-200">🖼 Image</button>
        </div>
      )}

      <EditorContent editor={editor} />

      {slashOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setSlashOpen(false)} />
          <div ref={slashRef} className="fixed z-20 bg-white rounded-xl shadow-xl border border-zinc-200 p-2 min-w-[200px] max-h-[300px] overflow-y-auto"
            style={{ top: slashPos.top, left: slashPos.left }}>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide px-2 py-1">Basic blocks</div>
            <SlashItem label="Heading 1" shortcut="H1" onClick={() => insertBlock("heading1")} />
            <SlashItem label="Heading 2" shortcut="H2" onClick={() => insertBlock("heading2")} />
            <SlashItem label="Heading 3" shortcut="H3" onClick={() => insertBlock("heading3")} />
            <div className="border-t border-zinc-100 my-1" />
            <SlashItem label="Bullet List" shortcut="\u2022" onClick={() => insertBlock("bulletList")} />
            <SlashItem label="Numbered List" shortcut="1." onClick={() => insertBlock("orderedList")} />
            <SlashItem label="Quote" shortcut={'"'} onClick={() => insertBlock("quote")} />
            <SlashItem label="Divider" shortcut="\u2014" onClick={() => insertBlock("divider")} />
            <SlashItem label="Code Block" shortcut="<>" onClick={() => insertBlock("code")} />
            <div className="border-t border-zinc-100 my-1" />
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide px-2 py-1">Media</div>
            <button onClick={() => { setSlashOpen(false); handleImageUpload(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50">
              <span className="text-base">\uD83D\uDDBC</span><span>Image</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ToolBtn({ active, onClick, label, style }: { active: boolean; onClick: () => void; label: string; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} className={`px-2 py-1 rounded text-xs transition-colors ${active ? "bg-indigo-100 text-indigo-700" : "text-zinc-600 hover:bg-zinc-200"}`} style={style}>
      {label}
    </button>
  );
}

function SlashItem({ label, shortcut, onClick }: { label: string; shortcut: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50">
      <span>{label}</span>
      <kbd className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{shortcut}</kbd>
    </button>
  );
}
