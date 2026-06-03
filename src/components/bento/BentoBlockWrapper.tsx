"use client";

import { useModeStore } from "@/store/modeStore";
import { usePageStore } from "@/store/pageStore";
import { BlockContentSwitcher } from "./BlockContentSwitcher";
import { BlockControls } from "./BlockControls";
import type { BentoBlock } from "@/types";

interface Props {
  block: BentoBlock;
  pageId: string;
}

export function BentoBlockWrapper({ block, pageId }: Props) {
  const mode = useModeStore((s) => s.mode);

  return (
    <div className="relative h-full flex flex-col">
      {mode === "edit" && (
        <BlockControls blockId={block.id} pageId={pageId} />
      )}
      <div className="flex-1 overflow-hidden">
        <BlockContentSwitcher block={block} pageId={pageId} />
      </div>
    </div>
  );
}
