"use client";

import { useState } from "react";
import { usePageStore } from "@/store/pageStore";
import { useModeStore } from "@/store/modeStore";
import { DataManager } from "@/components/shared/DataManager";
import type { Page, TreeNode } from "@/types";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTreeNodeItem({
  node,
  depth,
  onSelect,
  currentId,
}: {
  node: TreeNode;
  depth: number;
  onSelect: (id: string) => void;
  currentId: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.page.id });

  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = node.page.id === currentId;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <div
        className={`group flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
          isActive
            ? "bg-indigo-50 text-indigo-700 font-medium"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => onSelect(node.page.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(!menuOpen);
        }}
      >
        {/* Drag handle (6-dot grip) */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-200 transition-opacity shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-zinc-400">
            <circle cx="4" cy="3" r="1" />
            <circle cx="10" cy="3" r="1" />
            <circle cx="4" cy="7" r="1" />
            <circle cx="10" cy="7" r="1" />
            <circle cx="4" cy="11" r="1" />
            <circle cx="10" cy="11" r="1" />
          </svg>
        </button>

        <span className="text-base shrink-0">
          {node.page.icon ?? (node.page.type === "bento" ? "▦" : "📄")}
        </span>
        <span className="truncate flex-1">{node.page.title}</span>

        {/* Context menu trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-200 transition-opacity"
          data-no-dnd
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="7" cy="2" r="1.5" />
            <circle cx="7" cy="7" r="1.5" />
            <circle cx="7" cy="12" r="1.5" />
          </svg>
        </button>

        {/* Context menu dropdown */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute left-full ml-2 top-0 z-20 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 min-w-[140px]">
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={(e) => {
                  e.stopPropagation();
                  const store = usePageStore.getState();
                  store.createPage(
                    "Новая страница",
                    node.page.type,
                    node.page.id
                  );
                  setMenuOpen(false);
                }}
              >
                + Добавить подстраницу
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={(e) => {
                  e.stopPropagation();
                  const title = prompt("Новое название:", node.page.title);
                  if (title?.trim()) {
                    usePageStore
                      .getState()
                      .updatePage(node.page.id, { title: title.trim() });
                  }
                  setMenuOpen(false);
                }}
              >
                ✏️ Переименовать
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Удалить "${node.page.title}"?`)) {
                    usePageStore
                      .getState()
                      .deletePage(node.page.id);
                  }
                  setMenuOpen(false);
                }}
              >
                🗑️ Удалить
              </button>
            </div>
          </>
        )}
      </div>

      {node.children.length > 0 && (
        <SortableContext
          items={node.children.map((c) => c.page.id)}
          strategy={verticalListSortingStrategy}
        >
          {node.children.map((child) => (
            <SortableTreeNodeItem
              key={child.page.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              currentId={currentId}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
}

export function Sidebar() {
  const pages = usePageStore((s) => s.pages);
  const currentPageId = usePageStore((s) => s.currentPageId);
  const tree = usePageStore((s) => s.tree);
  const setCurrentPage = usePageStore((s) => s.setCurrentPage);
  const createPage = usePageStore((s) => s.createPage);
  const mode = useModeStore((s) => s.mode);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const store = usePageStore.getState();
    const activePage = store.pages.find((p) => p.id === active.id);
    const overPage = store.pages.find((p) => p.id === over.id);
    if (!activePage || !overPage) return;

    // Only reorder within the same parent level
    if (activePage.parentId !== overPage.parentId) return;

    const siblings = store.pages
      .filter((p) => p.parentId === activePage.parentId)
      .sort((a, b) => a.order - b.order);

    const oldIndex = siblings.findIndex((p) => p.id === active.id);
    const newIndex = siblings.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(siblings, oldIndex, newIndex);

    reordered.forEach((p, index) => {
      if (p.order !== index) {
        store.movePage(p.id, p.parentId, index);
      }
    });
  }

  const rootIds = tree.map((n) => n.page.id);
  const activeNode = activeId ? pages.find((p) => p.id === activeId) : null;

  if (mode === "view") return null;

  return (
    <aside className="w-[var(--sidebar-width)] border-r border-zinc-100 bg-white flex flex-col shrink-0">
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-zinc-100 shrink-0">
        <span className="font-semibold text-sm text-zinc-800">
          Bento Portfolio
        </span>
      </div>

      {/* Page list */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-2 space-y-0.5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(e) => setActiveId(e.active.id as string)}
          onDragEnd={handleDragEnd}
        >
          {tree.length === 0 ? (
            <p className="px-4 text-sm text-zinc-400 py-8 text-center">
              Нет страниц
            </p>
          ) : (
            <SortableContext
              items={rootIds}
              strategy={verticalListSortingStrategy}
            >
              {tree.map((node) => (
                <SortableTreeNodeItem
                  key={node.page.id}
                  node={node}
                  depth={0}
                  onSelect={(id) => setCurrentPage(id)}
                  currentId={currentPageId}
                />
              ))}
            </SortableContext>
          )}

          <DragOverlay>
            {activeNode ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-white shadow-lg border border-zinc-200">
                <span className="text-base">
                  {activeNode.icon ?? (activeNode.type === "bento" ? "▦" : "📄")}
                </span>
                <span className="truncate">{activeNode.title}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* New page button */}
      <div className="p-3 border-t border-zinc-100 relative">
        <button
          onClick={() => setShowNewMenu(!showNewMenu)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-zinc-200 text-sm text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
          Новая страница
        </button>

        {showNewMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowNewMenu(false)}
            />
            <div className="absolute bottom-full left-3 right-3 mb-2 z-20 bg-white rounded-lg shadow-lg border border-zinc-200 py-1">
              <button
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => {
                  createPage("Bento страница", "bento");
                  setShowNewMenu(false);
                }}
              >
                <span className="text-lg">▦</span>
                <div className="text-left">
                  <div className="font-medium">Bento Grid</div>
                  <div className="text-xs text-zinc-400">
                    Сетка с блоками
                  </div>
                </div>
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => {
                  createPage("Notion страница", "notion");
                  setShowNewMenu(false);
                }}
              >
                <span className="text-lg">📄</span>
                <div className="text-left">
                  <div className="font-medium">Notion страница</div>
                  <div className="text-xs text-zinc-400">
                    Блоковый редактор
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-zinc-100">
        <DataManager />
      </div>
    </aside>
  );
}
