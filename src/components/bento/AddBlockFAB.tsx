"use client";

import { useState } from "react";
import { usePageStore } from "@/store/pageStore";
import { generateId } from "@/lib/helpers";
import type { BentoPageContent, BentoBlockType, BentoBlock } from "@/types";

export function AddBlockFAB() {
  const [open, setOpen] = useState(false);
  const page = usePageStore((s) => s.getCurrentPage());
  const updatePage = usePageStore((s) => s.updatePage);

  if (!page || page.type !== "bento") return null;

  const addBlock = (type: BentoBlockType) => {
    const content = page.content as BentoPageContent;
    const id = generateId();

    const newBlock: BentoBlock = {
      id,
      type,
      content: type === "text" ? { html: "" } : { src: "" },
    };

    const maxY = content.layout.reduce((max, l) => Math.max(max, l.y + l.h), 0);
    const existingInRow = content.layout.filter(
      (l) => l.y === maxY || l.y === maxY
    );
    const startX = existingInRow.length > 0 ? 0 : 0;
    const startY = maxY;

    updatePage(page.id, {
      content: {
        ...content,
        layout: [
          ...content.layout,
          { i: id, x: startX, y: startY, w: 2, h: 1 },
        ],
        blocks: { ...content.blocks, [id]: newBlock },
      } as BentoPageContent,
    });

    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        data-testid="add-block"
        onClick={() => setOpen(!open)}
        className="absolute bottom-4 right-4 w-10 h-10 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-colors flex items-center justify-center"
        title="Add block"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 5v10M5 10h10" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-16 right-4 z-20 bg-white rounded-xl shadow-xl border border-zinc-200 p-2 min-w-[180px]">
            <div className="text-xs font-semibold text-zinc-500 px-2 py-1 uppercase tracking-wide">
              Add block
            </div>
            <button
              onClick={() => addBlock("text")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <span className="text-lg">📝</span> Text
            </button>
            <button
              onClick={() => addBlock("image")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <span className="text-lg">🖼</span> Image
            </button>
            <button
              onClick={() => addBlock("video")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <span className="text-lg">🎬</span> Video
            </button>
            <button
              onClick={() => addBlock("gif")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <span className="text-lg">🎯</span> GIF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
