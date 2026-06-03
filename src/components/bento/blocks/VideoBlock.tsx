"use client";

import { useRef, useState } from "react";
import { useModeStore } from "@/store/modeStore";
import { usePageStore } from "@/store/pageStore";
import { fileToBase64, validateFile } from "@/lib/media";
import { MediaLightbox } from "@/components/shared/MediaLightbox";
import type { BentoBlock, BentoPageContent } from "@/types";

interface Props {
  block: BentoBlock;
  pageId: string;
}

export function VideoBlock({ block, pageId }: Props) {
  const mode = useModeStore((s) => s.mode);
  const updatePage = usePageStore((s) => s.updatePage);
  const page = usePageStore((s) => s.pages.find((p) => p.id === pageId));
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const content = block.content as { src: string; caption?: string };
  const hasVideo = content.src && (content.src.startsWith("data:video") || content.src.includes("youtube.com") || content.src.includes("vimeo.com"));

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

  const handleUrl = () => {
    const url = prompt("Video URL (YouTube, Vimeo):");
    if (!url || !page || page.type !== "bento") return;
    const pc = page.content as BentoPageContent;
    updatePage(pageId, {
      content: {
        ...pc,
        blocks: {
          ...pc.blocks,
          [block.id]: { ...block, content: { ...content, src: url } },
        },
      } as BentoPageContent,
    });
  };

  const getEmbedUrl = (url: string): string | null => {
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return null;
  };

  if (!hasVideo) {
    if (mode === "view") {
      return (
        <div className="flex items-center justify-center h-full bg-zinc-50 text-zinc-300 text-xs">
          No video
        </div>
      );
    }

    return (
      <div
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center h-full cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 mb-2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span className="text-xs text-zinc-400">Click to upload or paste URL</span>
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="px-2 py-1 bg-zinc-100 rounded text-[10px] text-zinc-600 hover:bg-zinc-200"
          >
            Upload file
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUrl();
            }}
            className="px-2 py-1 bg-zinc-100 rounded text-[10px] text-zinc-600 hover:bg-zinc-200"
          >
            Paste URL
          </button>
        </div>
        {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    );
  }

  const embedUrl = getEmbedUrl(content.src);

  if (embedUrl) {
    return (
      <div className="relative h-full">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <video
        src={content.src}
        className={`w-full h-full object-contain bg-black ${mode === "view" ? "cursor-pointer" : ""}`}
        controls
        preload="metadata"
        onClick={() => mode === "view" && setLightboxOpen(true)}
      />
      {lightboxOpen && (
        <MediaLightbox
          src={content.src}
          type="video"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
