"use client";

import { useMemo } from "react";
import { usePageStore } from "@/store/pageStore";
import type { NotionPageContent } from "@/types";
import DOMPurify from "dompurify";

export function NotionView() {
  const page = usePageStore((s) => s.getCurrentPage());

  const sanitizedHtml = useMemo(() => {
    if (!page || page.type !== "notion") return null;
    const content = page.content as NotionPageContent;
    if (!content.html) return null;
    return DOMPurify.sanitize(content.html, {
      ALLOWED_TAGS: [
        "p", "br", "b", "i", "u", "s", "strong", "em", "del", "ins",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "blockquote", "pre", "code", "hr",
        "a", "img", "span", "div", "sub", "sup",
        "table", "thead", "tbody", "tr", "th", "td",
        "figure", "figcaption", "video", "source",
      ],
      ALLOWED_ATTR: [
        "href", "target", "rel", "src", "alt", "class", "id",
        "width", "height", "controls", "autoplay", "loop", "muted",
        "poster", "preload", "style",
      ],
      ALLOW_DATA_ATTR: true,
    });
  }, [page?.id, (page?.content as NotionPageContent)?.html]);

  if (!page || page.type !== "notion") return null;
  if (sanitizedHtml === null) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-300 text-sm">
        Empty page
      </div>
    );
  }

  return (
    <div
      className="notion-view prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
