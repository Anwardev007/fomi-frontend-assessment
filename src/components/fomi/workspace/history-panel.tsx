"use client";

import { History, Plus, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useFomiStore } from "@/components/fomi/store";
import type { HistoryEntry } from "@/components/fomi/types";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  onRestore: (entry: HistoryEntry) => void;
  onNewProject: () => void;
  compact?: boolean;
}

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function HistoryPanel({
  onRestore,
  onNewProject,
  compact,
}: HistoryPanelProps) {
  const history = useFomiStore((s) => s.history);
  const removeHistory = useFomiStore((s) => s.removeHistory);

  const recentPrompts = Array.from(
    new Set(history.map((h) => h.prompt)),
  ).slice(0, 6);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex items-center gap-2">
          <History className="size-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-100">History</h3>
          {history.length > 0 && (
            <Badge
              variant="outline"
              className="border-fomi-border bg-transparent px-1.5 text-[10px] text-zinc-400"
            >
              {history.length}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewProject}
          className="h-7 gap-1 px-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          <Plus className="size-3.5" />
          New
        </Button>
      </div>

      <ScrollArea className="fomi-scroll flex-1 px-2">
        {history.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-1.5 pb-3">
            <AnimatePresence initial={false}>
              {history.map((h) => (
                <motion.li
                  key={h.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => onRestore(h)}
                    className={cn(
                      "group flex w-full items-start gap-2.5 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-fomi-border hover:bg-white/[0.03]",
                    )}
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-fomi-border bg-black/40">
                      {h.variants[0] && (
                        <Image
                          src={h.variants[0].thumbUrl}
                          alt={h.prompt}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                      {h.variants.length > 1 && (
                        <span className="absolute bottom-0 right-0 rounded-tl bg-black/70 px-1 text-[9px] font-mono text-white">
                          ×{h.variants.length}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs leading-snug text-zinc-200">
                        {h.prompt}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <span className="font-mono">{h.model}</span>
                        <span>·</span>
                        <span>{relativeTime(h.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistory(h.id);
                      }}
                      className="grid size-6 shrink-0 place-items-center rounded text-zinc-500 opacity-0 transition-opacity hover:text-red-300 group-hover:opacity-100"
                      aria-label="Remove from history"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </ScrollArea>

      {!compact && recentPrompts.length > 0 && (
        <div className="border-t border-fomi-border p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            <Sparkles className="size-3" />
            Recent prompts
          </p>
          <div className="flex flex-wrap gap-1">
            {recentPrompts.map((p) => (
              <RecentPromptChip key={p} prompt={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecentPromptChip({ prompt }: { prompt: string }) {
  const setPrompt = useFomiStore((s) => s.setPrompt);
  return (
    <button
      type="button"
      onClick={() => setPrompt(prompt)}
      className="max-w-full truncate rounded-full border border-fomi-border bg-fomi-surface-2 px-2 py-0.5 text-[10px] text-zinc-400 transition-colors hover:text-zinc-100"
      title={prompt}
    >
      {prompt.split(",")[0]}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-full border border-dashed border-fomi-border text-zinc-600">
        <History className="size-5" />
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Your generations will appear here.
      </p>
      <p className="mt-1 text-[10px] text-zinc-600">
        Saved locally — survives reloads.
      </p>
    </div>
  );
}
