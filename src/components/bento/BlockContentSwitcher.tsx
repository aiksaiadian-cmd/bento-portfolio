"use client";

import { useModeStore } from "@/store/modeStore";
import { TextBlock } from "./blocks/TextBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { VideoBlock } from "./blocks/VideoBlock";
import { GifBlock } from "./blocks/GifBlock";
import type { BentoBlock } from "@/types";

interface Props {
  block: BentoBlock;
  pageId: string;
}

export function BlockContentSwitcher({ block, pageId }: Props) {
  const mode = useModeStore((s) => s.mode);

  switch (block.type) {
    case "text":
      return <TextBlock block={block} pageId={pageId} />;
    case "image":
      return <ImageBlock block={block} pageId={pageId} />;
    case "video":
      return <VideoBlock block={block} pageId={pageId} />;
    case "gif":
      return <GifBlock block={block} pageId={pageId} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-zinc-300 text-sm">
          Unknown block type
        </div>
      );
  }
}
