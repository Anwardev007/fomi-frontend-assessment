"use client";

import { create } from "zustand";
import type {
  AspectRatio,
  FomiModel,
  FomiStyle,
  HistoryEntry,
} from "@/components/fomi/types";

/**
 * Ephemeral workspace state shared across the hero prompt, the templates
 * section, and the workspace itself. History persistence to localStorage is
 * handled separately inside the workspace component to avoid SSR hydration
 * mismatches (Zustand persist reads from localStorage on the client only).
 */
interface FomiState {
  prompt: string;
  model: FomiModel;
  style: FomiStyle;
  aspectRatio: AspectRatio;
  guidance: number; // 1..20
  steps: number; // 10..50
  seed: string; // "" => random
  negativePrompt: string;
  batch: 1 | 2 | 3 | 4;

  setPrompt: (p: string) => void;
  setModel: (m: FomiModel) => void;
  setStyle: (s: FomiStyle) => void;
  setAspectRatio: (a: AspectRatio) => void;
  setGuidance: (n: number) => void;
  setSteps: (n: number) => void;
  setSeed: (s: string) => void;
  setNegativePrompt: (s: string) => void;
  setBatch: (n: 1 | 2 | 3 | 4) => void;

  // In-memory mirror of history (workspace owns the persistence source).
  history: HistoryEntry[];
  setHistory: (h: HistoryEntry[]) => void;
  prependHistory: (h: HistoryEntry) => void;
  removeHistory: (id: string) => void;
}

export const useFomiStore = create<FomiState>((set) => ({
  prompt: "",
  model: "fomi-v2-pro",
  style: "cinematic",
  aspectRatio: "1:1",
  guidance: 7.5,
  steps: 30,
  seed: "",
  negativePrompt: "",
  batch: 4,

  setPrompt: (prompt) => set({ prompt }),
  setModel: (model) => set({ model }),
  setStyle: (style) => set({ style }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setGuidance: (guidance) => set({ guidance }),
  setSteps: (steps) => set({ steps }),
  setSeed: (seed) => set({ seed }),
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
  setBatch: (batch) => set({ batch }),

  history: [],
  setHistory: (history) => set({ history }),
  prependHistory: (h) =>
    set((s) => ({ history: [h, ...s.history].slice(0, 40) })),
  removeHistory: (id) =>
    set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
}));

/** Smooth-scroll the workspace into view. Used by hero / templates CTAs. */
export function scrollToWorkspace() {
  if (typeof document === "undefined") return;
  const el = document.getElementById("workspace");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
