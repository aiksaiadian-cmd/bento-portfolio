"use client";

import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { usePageStore } from "@/store/pageStore";
import { useModeStore } from "@/store/modeStore";
import { BentoBlockWrapper } from "./BentoBlockWrapper";
import { AddBlockFAB } from "./AddBlockFAB";
import type { BentoPageContent } from "@/types";

const ROW_HEIGHT = 120;
const COLS = 4;

export function BentoGrid() {
  const page = usePageStore((s) => s.getCurrentPage());
  const updatePage = usePageStore((s) => s.updatePage);
  const mode = useModeStore((s) => s.mode);

  if (!page || page.type !== "bento") return null;

  const content = page.content as BentoPageContent;
  const layout = content.layout ?? [];
  const blocks = content.blocks ?? {};

  const onLayoutChange = (newLayout: { i: string; x: number; y: number; w: number; h: number }[]) => {
    updatePage(page.id, {
      content: {
        ...content,
        layout: newLayout.map((l) => ({
          i: l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
        })),
      } as BentoPageContent,
    });
  };

  const gridLayout = layout.map((l) => ({
    ...l,
    minW: l.minW ?? 1,
    minH: l.minH ?? 1,
  }));

  return (
    <div className="relative">
      <GridLayout
        className="layout"
        layout={gridLayout}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={1000}
        isDraggable={mode === "edit"}
        isResizable={mode === "edit"}
        compactType="vertical"
        margin={[12, 12]}
        containerPadding={[0, 0]}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
      >
        {gridLayout.map((item) => {
          const block = blocks[item.i];
          if (!block) return <div key={item.i} />;

          return (
            <div key={item.i} className="bento-block edit-mode">
              <BentoBlockWrapper block={block} pageId={page.id} />
            </div>
          );
        })}
      </GridLayout>

      {mode === "edit" && <AddBlockFAB />}
    </div>
  );
}
