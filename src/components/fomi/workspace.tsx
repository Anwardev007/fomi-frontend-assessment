"use client";

import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  ImageIcon,
  Layers,
  Loader2,
  PanelLeft,
  PanelRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useFomiStore } from "@/components/fomi/store";
import {
  ASPECT_RATIOS,
  MODELS,
  type AspectRatio,
  type GenerateResponse,
  type GeneratedVariant,
  type HistoryEntry,
} from "@/components/fomi/types";
import { PromptComposer } from "@/components/fomi/workspace/prompt-composer";
import { VariantCard } from "@/components/fomi/workspace/variant-card";
import { HistoryPanel } from "@/components/fomi/workspace/history-panel";
import { ParameterPanel } from "@/components/fomi/workspace/parameter-panel";
import { cn } from "@/lib/utils";

const HISTORY_KEY = "fomi-history-v1";

interface GenerateArgs {
  prompt: string;
  model: string;
  style: string;
  aspectRatio: string;
  count: number;
}

async function generate(args: GenerateArgs): Promise<GenerateResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error("Generation failed");
  return (await res.json()) as GenerateResponse;
}

function aspectCss(ar: AspectRatio): string {
  const found = ASPECT_RATIOS.find((a) => a.id === ar);
  if (!found) return "1 / 1";
  return `${found.w} / ${found.h}`;
}

export function Workspace() {
  const prompt = useFomiStore((s) => s.prompt);
  const model = useFomiStore((s) => s.model);
  const style = useFomiStore((s) => s.style);
  const aspectRatio = useFomiStore((s) => s.aspectRatio);
  const batch = useFomiStore((s) => s.batch);
  const seed = useFomiStore((s) => s.seed);
  const negativePrompt = useFomiStore((s) => s.negativePrompt);
  const guidance = useFomiStore((s) => s.guidance);
  const steps = useFomiStore((s) => s.steps);

  const setPrompt = useFomiStore((s) => s.setPrompt);
  const setModel = useFomiStore((s) => s.setModel);
  const setStyle = useFomiStore((s) => s.setStyle);
  const setAspectRatio = useFomiStore((s) => s.setAspectRatio);
  const prependHistory = useFomiStore((s) => s.prependHistory);
  const history = useFomiStore((s) => s.history);

  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const skipPersistRef = useRef(true);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  // Load history from localStorage on mount. Runs before the persist effect
  // (effects fire in declaration order), so the persist effect's first run is
  // skipped via skipPersistRef and only writes on subsequent history changes.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HistoryEntry[];
        if (Array.isArray(parsed)) {
          useFomiStore.getState().setHistory(parsed);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Persist history whenever it changes — skipping the first run (mount) so we
  // don't clobber stored history before the load effect has hydrated the store.
  useEffect(() => {
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      /* storage full / unavailable */
    }
  }, [history]);

  // Global keyboard: Cmd/Ctrl+K focuses the prompt.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        promptRef.current?.focus();
        promptRef.current?.select();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const mutation = useMutation({
    mutationFn: generate,
    onSuccess: (data) => {
      setVariants(data.variants);
      setLastLatency(data.latencyMs);
      const entry: HistoryEntry = {
        id: data.requestId,
        prompt: data.meta.prompt,
        model: data.meta.model,
        style: data.meta.style,
        aspectRatio: data.meta.aspectRatio,
        createdAt: new Date().toISOString(),
        variants: data.variants,
      };
      prependHistory(entry);
      toast.success(`Generated ${data.variants.length} variants`, {
        description: `${data.latencyMs}ms · ${data.meta.model}`,
      });
    },
    onError: () => {
      toast.error("Generation failed", {
        description: "The endpoint returned an error. Please retry.",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim() || mutation.isPending) return;
    mutation.mutate({
      prompt: prompt.trim(),
      model,
      style,
      aspectRatio,
      count: batch,
    });
  };

  const handleRestore = (entry: HistoryEntry) => {
    setPrompt(entry.prompt);
    setModel(entry.model);
    setStyle(entry.style);
    setAspectRatio(entry.aspectRatio);
    setVariants(entry.variants);
    setLeftOpen(false);
    toast("Restored from history", {
      description: "Parameters and canvas synced.",
    });
  };

  const handleNewProject = () => {
    setPrompt("");
    setVariants([]);
    setLeftOpen(false);
    promptRef.current?.focus();
  };

  const handleDeleteVariant = (id: string) => {
    setVariants((vs) => vs.filter((v) => v.id !== id));
  };

  const loading = mutation.isPending;
  const activeModel = MODELS.find((m) => m.id === model) ?? MODELS[0];
  const showSkeletons = loading;
  const showEmpty = !loading && variants.length === 0;

  return (
    <section
      id="workspace"
      aria-labelledby="workspace-heading"
      className="fomi-workspace dark relative scroll-mt-16 border-t border-fomi-border"
    >
      {/* Workspace heading band */}
      <div className="border-b border-fomi-border">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg fomi-gradient-bg shadow-lg shadow-fomi-accent/30">
              <Sparkles className="size-4 text-white" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fomi-accent-3">
                Part B · Product thinking
              </p>
              <h2
                id="workspace-heading"
                className="text-lg font-semibold tracking-tight text-zinc-50"
              >
                Image Generation Workspace
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile drawer triggers */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLeftOpen(true)}
              className="lg:hidden border-fomi-border bg-transparent text-zinc-300 hover:bg-white/5"
            >
              <PanelLeft className="size-4" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRightOpen(true)}
              className="lg:hidden border-fomi-border bg-transparent text-zinc-300 hover:bg-white/5"
            >
              <PanelRight className="size-4" />
              Params
            </Button>

            <div className="hidden items-center gap-2 rounded-lg border border-fomi-border bg-fomi-surface px-3 py-1.5 md:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-400">Engine ready</span>
              <span className="text-zinc-600">·</span>
              <span className="font-mono text-xs text-zinc-300">
                {activeModel.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr_320px]">
        {/* Left sidebar — desktop */}
        <aside className="hidden lg:block lg:border-r lg:border-fomi-border">
          <div className="sticky top-0 h-[calc(100vh-0px)] max-h-[calc(100vh-0px)]">
            <HistoryPanel
              onRestore={handleRestore}
              onNewProject={handleNewProject}
            />
          </div>
        </aside>

        {/* Center canvas */}
        <main className="flex min-w-0 flex-col gap-4 p-4 sm:p-6">
          <PromptComposer
            ref={promptRef}
            onGenerate={handleGenerate}
            loading={loading}
          />

          {/* Canvas */}
          <div className="fomi-panel flex-1 rounded-xl border p-4 sm:p-6">
            <CanvasHeader
              loading={loading}
              count={variants.length}
              batch={batch}
              aspectRatio={aspectRatio}
              latency={lastLatency}
              model={model}
              style={style}
            />

            <div className="mt-4">
              <AnimatePresence mode="wait">
                {showSkeletons ? (
                  <motion.div
                    key="skeletons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {Array.from({ length: batch }).map((_, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-xl border border-fomi-border bg-fomi-surface-2 fomi-shimmer"
                        style={{ aspectRatio: aspectCss(aspectRatio) }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="size-5 animate-spin text-zinc-600" />
                        </div>
                        <div className="absolute left-2 top-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 backdrop-blur">
                          variant {i + 1}/{batch}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : showEmpty ? (
                  <EmptyCanvas />
                ) : (
                  <motion.div
                    key="variants"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {variants.map((v, i) => (
                      <VariantCard
                        key={v.id}
                        variant={v}
                        index={i}
                        onDelete={handleDeleteVariant}
                        onUsePrompt={(p) => {
                          setPrompt(p);
                          promptRef.current?.focus();
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Right sidebar — desktop */}
        <aside className="hidden lg:block lg:border-l lg:border-fomi-border">
          <div className="sticky top-0 h-[calc(100vh-0px)] max-h-[calc(100vh-0px)]">
            <ParameterPanel />
          </div>
        </aside>
      </div>

      {/* Mobile: left drawer (history) */}
      <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
        <SheetContent
          side="left"
          className="dark w-[85%] max-w-sm border-fomi-border bg-fomi-ink p-0 text-zinc-100 sm:max-w-sm"
        >
          <SheetTitle className="flex items-center gap-2 border-b border-fomi-border px-3 py-3 text-sm text-zinc-100">
            <History className="size-4 text-zinc-400" />
            History
          </SheetTitle>
          <div className="h-[calc(100%-3rem)]">
            <HistoryPanel
              onRestore={handleRestore}
              onNewProject={handleNewProject}
              compact
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile: right drawer (parameters) */}
      <Sheet open={rightOpen} onOpenChange={setRightOpen}>
        <SheetContent
          side="right"
          className="dark w-[85%] max-w-sm border-fomi-border bg-fomi-ink p-0 text-zinc-100 sm:max-w-sm"
        >
          <SheetTitle className="flex items-center gap-2 border-b border-fomi-border px-3 py-3 text-sm text-zinc-100">
            <Layers className="size-4 text-zinc-400" />
            Parameters
          </SheetTitle>
          <div className="h-[calc(100%-3rem)]">
            <ParameterPanel />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function CanvasHeader({
  loading,
  count,
  batch,
  aspectRatio,
  latency,
  model,
  style,
}: {
  loading: boolean;
  count: number;
  batch: number;
  aspectRatio: AspectRatio;
  latency: number | null;
  model: string;
  style: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-zinc-100">Canvas</h3>
        <Badge
          variant="outline"
          className="border-fomi-border bg-transparent text-[10px] text-zinc-400"
        >
          {loading ? `${batch} generating` : `${count} on canvas`}
        </Badge>
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
        <span>{aspectRatio}</span>
        <span>·</span>
        <span className="capitalize">{style.replace("-", " ")}</span>
        <span>·</span>
        <span>{model}</span>
        {latency !== null && (
          <>
            <span>·</span>
            <span className="text-fomi-accent-3">{latency}ms</span>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyCanvas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-fomi-border bg-fomi-surface-2/40 p-8 text-center"
    >
      <div className="relative">
        <div className="grid size-16 place-items-center rounded-2xl border border-fomi-border bg-fomi-surface">
          <ImageIcon className="size-6 text-zinc-600" />
        </div>
        <div className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full fomi-gradient-bg">
          <Sparkles className="size-2.5 text-white" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-200">
        Your creations will appear here
      </p>
      <p className="mt-1 max-w-xs text-xs text-zinc-500">
        Write a prompt above and hit{" "}
        <kbd className="rounded bg-white/5 px-1 font-mono text-[10px]">⌘↵</kbd>{" "}
        to generate. Try a template from above to get started.
      </p>
    </motion.div>
  );
}
