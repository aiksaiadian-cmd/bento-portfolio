import { create } from "zustand";
import type { Mode } from "@/types";

interface ModeStore {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

export const useModeStore = create<ModeStore>((set) => ({
  mode: "edit",
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((s) => ({ mode: s.mode === "edit" ? "view" : "edit" })),
}));
