"use client";

import { forwardRef } from "react";
import { Command, Loader2, Shuffle, Sparkles, SquareTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFomiStore } from "@/components/fomi/store";
import { MODELS, SAMPLE_PROMPTS } from "@/components/fomi/types";

interface PromptComposerProps {
  onGenerate: () => void;
  loading: boolean;
}

const MAX_CHARS = 800;

export const PromptComposer = forwardRef<
  HTMLTextAreaElement,
  PromptComposerProps
>(function PromptComposer({ onGenerate, loading }, ref) {
  const prompt = useFomiStore((s) => s.prompt);
  const setPrompt = useFomiStore((s) => s.setPrompt);
  const model = useFomiStore((s) => s.model);
  const activeModel = MODELS.find((m) => m.id === model) ?? MODELS[0];

  const remaining = MAX_CHARS - prompt.length;
  const tooLong = remaining < 0;

  const surprise = () => {
    const next = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(next);
  };

  return (
    <div className="fomi-panel rounded-xl border">
      <div className="flex items-center justify-between gap-2 border-b border-fomi-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md fomi-gradient-bg">
            <Sparkles className="size-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-medium text-zinc-100">Prompt</span>
          <span className="hidden items-center gap-1 rounded-md bg-fomi-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-fomi-accent-3 sm:inline-flex">
            {activeModel.name}
          </span>
        </div>
        <button
          type="button"
          onClick={surprise}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
        >
          <Shuffle className="size-3" />
          Surprise me
        </button>
      </div>

      <div className="p-3">
        <Textarea
          ref={ref}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS + 50))}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              if (!loading && prompt.trim()) onGenerate();
            }
          }}
          placeholder="Describe your image. Be specific about subject, light, lens, mood…"
          rows={4}
          className="min-h-[110px] resize-none border-0 bg-transparent px-1 text-sm text-zinc-100 shadow-none outline-none placeholder:text-zinc-500 focus-visible:ring-0"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span className={tooLong ? "text-red-400" : ""}>
              {prompt.length}/{MAX_CHARS}
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <SquareTerminal className="size-3" />
              <kbd className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px]">⌘</kbd>
              <kbd className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px]">↵</kbd>
              <span>to generate</span>
            </span>
            <span className="hidden items-center gap-1 lg:flex">
              <Command className="size-3" />
              <kbd className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px]">⌘</kbd>
              <kbd className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px]">K</kbd>
              <span>to focus</span>
            </span>
          </div>
          <Button
            type="button"
            onClick={onGenerate}
            disabled={loading || !prompt.trim() || tooLong}
            className="fomi-gradient-bg h-9 border-0 text-white shadow-md shadow-fomi-accent/30 hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                Generate
                <kbd className="ml-1 rounded bg-black/20 px-1 font-mono text-[10px]">⌘↵</kbd>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});
