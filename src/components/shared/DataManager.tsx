"use client";

import { useCallback, useRef, useState } from "react";
import { usePageStore } from "@/store/pageStore";
import { exportData, importData } from "@/lib/storage";

export function DataManager() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bento-portfolio-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Data exported!");
    setTimeout(() => setMessage(null), 2000);
  }, []);

  const handleImport = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = importData(reader.result as string);
        if (result) {
          setMessage("Data imported! Reloading...");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setMessage("Invalid backup file");
          setTimeout(() => setMessage(null), 3000);
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const handleReset = useCallback(() => {
    if (confirm("Reset all data? This cannot be undone.")) {
      if (confirm("Are you sure? All pages will be lost.")) {
        localStorage.removeItem("bento-portfolio-data");
        setMessage("Data reset! Reloading...");
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7" cy="7" r="2.5" />
          <path d="M7 1v1M7 12v1M1 7h1M12 7h1M2.5 2.5l.7.7M10.8 10.8l.7.7M2.5 11.5l.7-.7M10.8 3.2l.7-.7" />
        </svg>
        Settings
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white rounded-xl shadow-xl border border-zinc-200 p-3">
            <div className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
              Data
            </div>
            <div className="space-y-1">
              <button
                onClick={handleExport}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
              >
                ⬇️ Export Backup
              </button>
              <button
                onClick={handleImport}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
              >
                📥 Import Backup
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="border-t border-zinc-100 my-1" />
              <button
                onClick={handleReset}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
              >
                🗑️ Reset All Data
              </button>
            </div>
            {message && (
              <div className="mt-2 text-xs text-indigo-600 text-center">
                {message}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
