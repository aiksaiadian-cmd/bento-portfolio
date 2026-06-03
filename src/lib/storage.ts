import type { Page } from "@/types";

const STORAGE_KEY = "bento-portfolio-data";

interface StorageData {
  pages: Page[];
  media: Record<string, string>;
}

function load(): StorageData {
  if (typeof window === "undefined") return { pages: [], media: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { pages: [], media: {} };
    return JSON.parse(raw) as StorageData;
  } catch {
    return { pages: [], media: {} };
  }
}

function save(data: StorageData): boolean {
  if (typeof window === "undefined") return true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded. Try exporting and clearing old data.");
    } else {
      console.error("Failed to save data:", e);
    }
    return false;
  }
}

export function getAllPages(): Page[] {
  return load().pages;
}

export function getPage(id: string): Page | null {
  return load().pages.find((p) => p.id === id) ?? null;
}

export function savePage(page: Page): void {
  const data = load();
  const idx = data.pages.findIndex((p) => p.id === page.id);
  if (idx >= 0) {
    data.pages[idx] = page;
  } else {
    data.pages.push(page);
  }
  save(data);
}

export function deletePage(id: string): void {
  const data = load();
  data.pages = data.pages.filter((p) => p.id !== id);
  save(data);
}

export function getMedia(id: string): string | null {
  return load().media[id] ?? null;
}

export function saveMedia(id: string, base64: string): void {
  const data = load();
  data.media[id] = base64;
  save(data);
}

export function deleteMedia(id: string): void {
  const data = load();
  delete data.media[id];
  save(data);
}

export function exportData(): string {
  return JSON.stringify(load(), null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json) as StorageData;
    if (!Array.isArray(data.pages) || typeof data.media !== "object") {
      return false;
    }
    save(data);
    return true;
  } catch {
    return false;
  }
}

interface TreeNode {
  page: Page;
  children: TreeNode[];
}

export function buildTree(pages: Page[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const p of [...pages].sort((a, b) => a.order - b.order)) {
    map.set(p.id, { page: p, children: [] });
  }

  for (const p of pages) {
    const node = map.get(p.id)!;
    if (p.parentId && map.has(p.parentId)) {
      map.get(p.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
