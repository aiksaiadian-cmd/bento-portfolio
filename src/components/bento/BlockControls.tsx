"use client";

import { useState } from "react";
import { usePageStore } from "@/store/pageStore";
import { BlockTypeSelector } from "./BlockTypeSelector";
import type { BentoPageContent } from "@/types";

interface Props {
  blockId: string;
  pageId: string;
}

export function BlockControls({ blockId, pageId }: Props) {
  const page = usePageStore((s) => s.pages.find((p) => p.id === pageId));
  const updatePage = usePageStore((s) => s.updatePage);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  if (!page || page.type !== "bento") return null;

  const content = page.content as BentoPageContent;
  const layoutItem = content.layout.find((l) => l.i === blockId);

  const handleDelete = () => {
    updatePage(pageId, {
      content: {
        ...content,
        layout: content.layout.filter((l) => l.i !== blockId),
        blocks: Object.fromEntries(
          Object.entries(content.blocks).filter(([id]) => id !== blockId)
        ),
      } as BentoPageContent,
    });
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-50 border-b border-zinc-100">
      {/* Drag handle */}
      <div className="drag-handle cursor-grab active:cursor-grabbing p-0.5 text-zinc-400 hover:text-zinc-600">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="3" cy="2" r="1" /><circle cx="9" cy="2" r="1" />
          <circle cx="3" cy="6" r="1" /><circle cx="9" cy="6" r="1" />
          <circle cx="3" cy="10" r="1" /><circle cx="9" cy="10" r="1" />
        </svg>
      </div>

      {/* Block size info */}
      {layoutItem && (
        <span className="text-[10px] text-zinc-400 font-mono mr-auto">
          {layoutItem.w}×{layoutItem.h}
        </span>
      )}

      {/* Change type */}
      <div className="relative">
        <button
          onClick={() => setShowTypeMenu(!showTypeMenu)}
          className="p-0.5 text-zinc-400 hover:text-zinc-600 rounded hover:bg-zinc-200"
          title="Change block type"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="2.5" />
            <path d="M6 1v1M6 10v1M1 6h1M10 6h1M2.5 2.5l.7.7M8.8 8.8l.7.7M2.5 9.5l.7-.7M8.8 3.2l.7-.7" />
          </svg>
        </button>
        {showTypeMenu && (
          <BlockTypeSelector
            blockId={blockId}
            pageId={pageId}
            onClose={() => setShowTypeMenu(false)}
          />
        )}
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="p-0.5 text-zinc-400 hover:text-red-500 rounded hover:bg-red-50"
        title="Delete block"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 3l6 6M9 3l-6 6" />
        </svg>
      </button>
    </div>
  );
}
