"use client";

import { useRef, useState } from "react";
import { useModeStore } from "@/store/modeStore";
import { usePageStore } from "@/store/pageStore";
import { fileToBase64, validateFile } from "@/lib/media";
import type { BentoBlock, BentoPageContent } from "@/types";

interface Props {
  block: BentoBlock;
  pageId: string;
}

export function GifBlock({ block, pageId }: Props) {
  const mode = useModeStore((s) => s.mode);
  const updatePage = usePageStore((s) => s.updatePage);
  const page = usePageStore((s) => s.pages.find((p) => p.id === pageId));
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const content = block.content as { src: string; alt?: string };
  const hasGif = content.src && content.src.startsWith("data:image/gif");

  const handleFile = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid file");
      return;
    }
    setError(null);
    const base64 = await fileToBase64(file);
    if (!page || page.type !== "bento") return;
    const pc = page.content as BentoPageContent;
    updatePage(pageId, {
      content: {
        ...pc,
        blocks: {
          ...pc.blocks,
          [block.id]: { ...block, content: { ...content, src: base64 } },
        },
      } as BentoPageContent,
    });
  };

  if (!hasGif) {
    if (mode === "view") {
      return (
        <div className="flex items-center justify-center h-full bg-zinc-50 text-zinc-300 text-xs">
          No GIF
        </div>
      );
    }

    return (
      <div
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center h-full cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 mb-2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <text x="7" y="17" fontSize="10" fill="currentColor" stroke="none" fontWeight="bold">GIF</text>
        </svg>
        <span className="text-xs text-zinc-400">Click to add GIF</span>
        {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content.src}
        alt={content.alt ?? ""}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
