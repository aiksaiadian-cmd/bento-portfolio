"use client";

import { usePageStore } from "@/store/pageStore";
import type { BentoPageContent, BentoBlockType, BentoBlock } from "@/types";

interface Props {
  blockId: string;
  pageId: string;
  onClose: () => void;
}

const BLOCK_TYPES: { type: BentoBlockType; icon: string; label: string }[] = [
  { type: "text", icon: "📝", label: "Text" },
  { type: "image", icon: "🖼", label: "Image" },
  { type: "video", icon: "🎬", label: "Video" },
  { type: "gif", icon: "🎯", label: "GIF" },
];

export function BlockTypeSelector({ blockId, pageId, onClose }: Props) {
  const page = usePageStore((s) => s.pages.find((p) => p.id === pageId));
  const updatePage = usePageStore((s) => s.updatePage);

  if (!page || page.type !== "bento") return null;

  const changeType = (newType: BentoBlockType) => {
    const content = page.content as BentoPageContent;
    const existing = content.blocks[blockId];

    const newBlock: BentoBlock = {
      id: blockId,
      type: newType,
      content: newType === "text" ? { html: "" } : { src: "" },
    };

    updatePage(pageId, {
      content: {
        ...content,
        blocks: { ...content.blocks, [blockId]: newBlock },
      } as BentoPageContent,
    });

    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-1 z-30 bg-white rounded-xl shadow-xl border border-zinc-200 p-2 min-w-[140px]">
      {BLOCK_TYPES.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => changeType(type)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-lg">{icon}</span> {label}
        </button>
      ))}
    </div>
  );
}
