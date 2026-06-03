"use client";

import { usePageStore } from "@/store/pageStore";
import { useModeStore } from "@/store/modeStore";
import { generateId } from "@/lib/helpers";
import type { BentoPageContent, BentoBlock, BentoBlockType } from "@/types";

function addBlock(type: BentoBlockType) {
  const store = usePageStore.getState();
  const page = store.getCurrentPage();
  if (!page || page.type !== "bento") return;

  const content = page.content as BentoPageContent;
  const id = generateId();

  const newBlock: BentoBlock = {
    id,
    type,
    content: type === "text" ? { html: "" } : { src: "" },
  };

  const maxY = content.layout.reduce((max, l) => Math.max(max, l.y + l.h), 0);
  const startY = maxY;

  store.updatePage(page.id, {
    content: {
      ...content,
      layout: [
        ...content.layout,
        { i: id, x: 0, y: startY, w: type === "text" ? 2 : 2, h: type === "text" ? 2 : 3 },
      ],
      blocks: { ...content.blocks, [id]: newBlock },
    } as BentoPageContent,
  });
}

export function HeaderTools() {
  const page = usePageStore((s) => s.getCurrentPage());
  const mode = useModeStore((s) => s.mode);

  if (mode !== "edit" || !page || page.type !== "bento") return null;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => addBlock("text")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 3h8M7 3v8" />
        </svg>
        Text
      </button>
      <button
        onClick={() => addBlock("image")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" />
          <circle cx="5" cy="5.5" r="1" />
          <path d="M1.5 10l3-3 2 2 3-3 3 3" />
        </svg>
        Image
      </button>
      <button
        onClick={() => addBlock("video")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <polygon points="2 2.5 10 7 2 11.5 2 2.5" />
        </svg>
        Video
      </button>
    </div>
  );
}
