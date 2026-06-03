import { create } from "zustand";
import type { Page, PageType, TreeNode } from "@/types";
import { generateId } from "@/lib/helpers";
import * as storage from "@/lib/storage";

interface PageStore {
  pages: Page[];
  currentPageId: string | null;
  tree: TreeNode[];

  createPage: (title: string, type: PageType, parentId?: string) => string;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  movePage: (id: string, newParentId: string | null, newOrder: number) => void;
  setCurrentPage: (id: string) => void;
  getCurrentPage: () => Page | null;
  getTree: () => TreeNode[];
  uploadMedia: (file: File) => Promise<string>;
  getMediaUrl: (mediaId: string) => string | null;
  init: () => void;
}

function createDefaultPage(title: string, type: PageType, parentId: string | null = null, order = 0): Page {
  const now = Date.now();
  return {
    id: generateId(),
    title,
    type,
    parentId,
    order,
    icon: null,
    content:
      type === "bento"
        ? { type: "bento", layout: [], blocks: {} }
        : { type: "notion", title, blocks: [] },
    createdAt: now,
    updatedAt: now,
  };
}

function removePageRecursive(pages: Page[], id: string): Page[] {
  const children = pages.filter((p) => p.parentId === id);
  const idsToRemove = new Set<string>([id]);
  for (const child of children) {
    const removed = removePageRecursive(pages, child.id);
    removed.forEach((p) => idsToRemove.add(p.id));
  }
  return pages.filter((p) => !idsToRemove.has(p.id));
}

function buildTree(pages: Page[]): TreeNode[] {
  return storage.buildTree(pages) as TreeNode[];
}

export const usePageStore = create<PageStore>((set, get) => ({
  pages: [],
  currentPageId: null,
  tree: [],

  init: () => {
    const stored = storage.getAllPages();
    if (stored.length > 0) {
      set({ pages: stored, currentPageId: stored[0].id, tree: buildTree(stored) });
      return;
    }

    const main = createDefaultPage("Главная", "bento", null, 0);
    const projects = createDefaultPage("Проекты", "notion", null, 1);
    const contacts = createDefaultPage("Контакты", "bento", null, 2);

    const defaults = [main, projects, contacts];
    defaults.forEach((p) => storage.savePage(p));
    set({ pages: defaults, currentPageId: main.id, tree: buildTree(defaults) });
  },

  createPage: (title, type, parentId?) => {
    const pages = get().pages;
    const order = pages.filter((p) => p.parentId === (parentId ?? null)).length;
    const page = createDefaultPage(title, type, parentId ?? null, order);
    storage.savePage(page);
    const next = [...pages, page];
    set({ pages: next, tree: buildTree(next) });
    return page.id;
  },

  updatePage: (id, updates) => {
    const pages = get().pages.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
    );
    const updated = pages.find((p) => p.id === id);
    if (updated) storage.savePage(updated);
    set({ pages, tree: buildTree(pages) });
  },

  deletePage: (id) => {
    const pages = removePageRecursive(get().pages, id);
    pages.forEach((p) => storage.deletePage(p.id));
    const current = get().currentPageId;
    set({
      pages,
      tree: buildTree(pages),
      currentPageId: current === id ? (pages[0]?.id ?? null) : current,
    });
  },

  movePage: (id, newParentId, newOrder) => {
    const pages = get().pages.map((p) => {
      if (p.id !== id) return p;
      const moved = { ...p, parentId: newParentId, order: newOrder, updatedAt: Date.now() };
      storage.savePage(moved);
      return moved;
    });
    set({ pages, tree: buildTree(pages) });
  },

  setCurrentPage: (id) => set({ currentPageId: id }),

  getCurrentPage: () => {
    const { pages, currentPageId } = get();
    return pages.find((p) => p.id === currentPageId) ?? null;
  },

  getTree: () => {
    return get().tree;
  },

  uploadMedia: async (file: File) => {
    const media = await import("@/lib/media");
    const base64 = await media.fileToBase64(file);
    const id = generateId();
    storage.saveMedia(id, base64);
    return id;
  },

  getMediaUrl: (mediaId) => storage.getMedia(mediaId),
}));
