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

export function ImageBlock({ block, pageId }: Props) {
  const mode = useModeStore((s) => s.mode);
  const updatePage = usePageStore((s) => s.updatePage);
  const page = usePageStore((s) => s.pages.find((p) => p.id === pageId));
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const content = block.content as { src: string; alt?: string; caption?: string };
  const hasImage = content.src && content.src.startsWith("data:image");

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (!hasImage) {
    if (mode === "view") {
      return (
        <div className="flex items-center justify-center h-full bg-zinc-50 text-zinc-300 text-xs">
          No image
        </div>
      );
    }

    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center h-full cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 mb-2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span className="text-xs text-zinc-400">Click or drop image</span>
        {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
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
      {content.caption && mode === "view" && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <span className="text-white text-xs">{content.caption}</span>
        </div>
      )}
    </div>
  );
}
