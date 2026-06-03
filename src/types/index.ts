export type PageType = "bento" | "notion";

export interface Page {
  id: string;
  title: string;
  type: PageType;
  parentId: string | null;
  order: number;
  icon: string | null;
  content: BentoPageContent | NotionPageContent;
  createdAt: number;
  updatedAt: number;
}

export interface BentoPageContent {
  type: "bento";
  layout: BentoLayoutItem[];
  blocks: Record<string, BentoBlock>;
}

export interface BentoLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export type BentoBlockType = "text" | "image" | "video" | "gif";

export interface BentoBlock {
  id: string;
  type: BentoBlockType;
  content: TextContent | MediaContent;
  style?: BlockStyle;
}

export interface TextContent {
  html: string;
}

export interface MediaContent {
  src: string;
  alt?: string;
  caption?: string;
}

export interface BlockStyle {
  bgColor?: string;
  borderRadius?: "sm" | "md" | "lg" | "full";
  padding?: "sm" | "md" | "lg";
}

export interface NotionPageContent {
  type: "notion";
  title: string;
  blocks: NotionBlock[];
  html?: string;
}

export type NotionBlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "orderedList"
  | "quote"
  | "divider"
  | "image"
  | "video"
  | "code";

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  content: unknown;
  children?: NotionBlock[];
}

export type Mode = "edit" | "view";

export interface TreeNode {
  page: Page;
  children: TreeNode[];
}
