import { getAllPages, savePage, getPage, deletePage, buildTree, exportData, importData } from "@/lib/storage";
import type { Page } from "@/types";

const STORAGE_KEY = "bento-portfolio-data";

const mockPage: Page = {
  id: "page-1",
  title: "Test Page",
  type: "bento",
  parentId: null,
  order: 0,
  icon: null,
  content: { type: "bento", layout: [], blocks: {} },
  createdAt: 1000,
  updatedAt: 1000,
};

const mockPage2: Page = {
  ...mockPage,
  id: "page-2",
  title: "Child Page",
  parentId: "page-1",
  order: 1,
};

beforeEach(() => {
  localStorage.clear();
});

describe("getAllPages", () => {
  it("returns empty array when no data", () => {
    expect(getAllPages()).toEqual([]);
  });

  it("returns saved pages", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pages: [mockPage], media: {} }));
    expect(getAllPages()).toEqual([mockPage]);
  });
});

describe("savePage", () => {
  it("saves a new page", () => {
    savePage(mockPage);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(data.pages).toEqual([mockPage]);
  });

  it("updates an existing page", () => {
    savePage(mockPage);
    const updated = { ...mockPage, title: "Updated" };
    savePage(updated);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(data.pages).toHaveLength(1);
    expect(data.pages[0].title).toBe("Updated");
  });
});

describe("getPage", () => {
  it("returns null for missing page", () => {
    expect(getPage("nonexistent")).toBeNull();
  });

  it("returns the page by id", () => {
    savePage(mockPage);
    expect(getPage("page-1")).toEqual(mockPage);
  });
});

describe("deletePage", () => {
  it("removes a page", () => {
    savePage(mockPage);
    deletePage("page-1");
    expect(getAllPages()).toEqual([]);
  });

  it("does nothing when id does not exist", () => {
    savePage(mockPage);
    deletePage("nonexistent");
    expect(getAllPages()).toHaveLength(1);
  });
});

describe("buildTree", () => {
  it("builds a tree from flat pages", () => {
    const tree = buildTree([mockPage2, mockPage]);
    expect(tree).toHaveLength(1);
    expect(tree[0].page.id).toBe("page-1");
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].page.id).toBe("page-2");
  });

  it("returns empty array for empty input", () => {
    expect(buildTree([])).toEqual([]);
  });

  it("preserves input order for root nodes", () => {
    const p0 = { ...mockPage, id: "a", order: 1 };
    const p1 = { ...mockPage, id: "b", order: 0 };
    const tree = buildTree([p0, p1]);
    expect(tree[0].page.id).toBe("a");
    expect(tree[1].page.id).toBe("b");
  });
});

describe("exportData", () => {
  it("exports current data as JSON string", () => {
    savePage(mockPage);
    const exported = exportData();
    const parsed = JSON.parse(exported);
    expect(parsed.pages).toEqual([mockPage]);
    expect(parsed.media).toEqual({});
  });

  it("exports empty data", () => {
    const exported = exportData();
    const parsed = JSON.parse(exported);
    expect(parsed.pages).toEqual([]);
    expect(parsed.media).toEqual({});
  });
});

describe("importData", () => {
  it("imports valid data", () => {
    const json = JSON.stringify({ pages: [mockPage], media: {} });
    expect(importData(json)).toBe(true);
    expect(getAllPages()).toEqual([mockPage]);
  });

  it("rejects invalid JSON", () => {
    expect(importData("not json")).toBe(false);
    expect(getAllPages()).toEqual([]);
  });

  it("rejects data without pages array", () => {
    expect(importData(JSON.stringify({ media: {} }))).toBe(false);
  });

  it("rejects data without media object", () => {
    expect(importData(JSON.stringify({ pages: [] }))).toBe(false);
  });
});
