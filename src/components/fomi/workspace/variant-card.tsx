"use client";

import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Maximize2,
  Pencil,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GeneratedVariant } from "@/components/fomi/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VariantCardProps {
  variant: GeneratedVariant;
  index: number;
  onDelete?: (id: string) => void;
  onUsePrompt?: (prompt: string) => void;
}

const ACTIONS = [
  {
    key: "upscale",
    label: "Upscale to 4K",
    icon: Maximize2,
  },
  {
    key: "variations",
    label: "Make variations",
    icon: Sparkles,
  },
  {
    key: "edit",
    label: "Edit (inpaint)",
    icon: Pencil,
  },
  {
    key: "copy-prompt",
    label: "Copy prompt",
    icon: Copy,
  },
  {
    key: "download",
    label: "Download",
    icon: Download,
  },
] as const;

export function VariantCard({
  variant,
  index,
  onDelete,
  onUsePrompt,
}: VariantCardProps) {
  const [open, setOpen] = useState(false);

  const handleAction = (key: string) => {
    switch (key) {
      case "download":
        toast.success("Download queued", {
          description: `${variant.width}×${variant.height} · seed ${variant.seed}`,
        });
        break;
      case "upscale":
        toast.info("Upscaling to 4K…", {
          description: "Detail-preserving super-resolution.",
        });
        break;
      case "variations":
        onUsePrompt?.(variant.prompt);
        toast.success("Prompt loaded for variations", {
          description: "Tweak and regenerate from the composer above.",
        });
        break;
      case "edit":
        toast.info("Opening editor…", {
          description: "Brush-aware inpaint coming to your canvas.",
        });
        break;
      case "copy-prompt":
        void navigator.clipboard?.writeText(variant.prompt);
        toast.success("Prompt copied");
        break;
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: index * 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="group relative overflow-hidden rounded-xl border border-fomi-border bg-fomi-surface-2"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full"
          aria-label={`Open variant ${index + 1} (seed ${variant.seed})`}
        >
          <div className="relative w-full bg-black/40">
            <Image
              src={variant.url}
              alt={variant.prompt}
              width={variant.width}
              height={variant.height}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* Index ribbon */}
            <span className="absolute left-2 top-2 grid size-6 place-items-center rounded-md bg-black/55 font-mono text-[11px] font-medium text-white backdrop-blur">
              {index + 1}
            </span>
            {/* Score chips */}
            <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
              <span className="rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur">
                aesth {variant.aestheticScore.toFixed(2)}
              </span>
              <span className="rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur">
                adhere {variant.promptAdherence.toFixed(2)}
              </span>
            </div>
          </div>
        </button>

        {/* Hover action bar */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-0.5">
            {ACTIONS.map((a) => (
              <Tooltip key={a.key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(a.key);
                    }}
                    className="grid size-8 place-items-center rounded-md bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
                    aria-label={a.label}
                  >
                    <a.icon className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">{a.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(variant.id);
                  }}
                  className="grid size-8 place-items-center rounded-md bg-white/10 text-red-300 backdrop-blur transition-colors hover:bg-red-500/30 hover:text-red-200"
                  aria-label="Delete variant"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Delete</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Always-visible footer: seed */}
        <div className="flex items-center justify-between border-t border-fomi-border px-2.5 py-1.5 font-mono text-[10px] text-zinc-400">
          <span>seed · {variant.seed}</span>
          <span className="capitalize">{variant.style.replace("-", " ")}</span>
        </div>
      </motion.article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="dark max-w-4xl gap-0 overflow-hidden border-fomi-border bg-fomi-surface p-0 text-zinc-100 sm:max-w-4xl"
        >
          <DialogTitle className="sr-only">Variant detail</DialogTitle>
          <DialogDescription className="sr-only">
            {variant.prompt}
          </DialogDescription>
          <div className="grid md:grid-cols-[1.6fr_1fr]">
            <div className="relative bg-black/50">
              <Image
                src={variant.url}
                alt={variant.prompt}
                width={variant.width}
                height={variant.height}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="h-auto max-h-[80vh] w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Wand2 className="size-3 text-fomi-accent-3" />
                  Prompt
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-100">
                  {variant.prompt}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Meta label="Model" value={variant.model} />
                <Meta label="Style" value={variant.style.replace("-", " ")} />
                <Meta label="Aspect" value={variant.aspectRatio} />
                <Meta
                  label="Dimensions"
                  value={`${variant.width}×${variant.height}`}
                />
                <Meta label="Seed" value={`${variant.seed}`} mono />
                <Meta
                  label="Created"
                  value={new Date(variant.createdAt).toLocaleTimeString()}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ScoreBar
                  label="Aesthetic"
                  value={variant.aestheticScore}
                />
                <ScoreBar
                  label="Prompt adherence"
                  value={variant.promptAdherence}
                />
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-fomi-border pt-4">
                {ACTIONS.map((a) => (
                  <Button
                    key={a.key}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "border-fomi-border bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white",
                    )}
                    onClick={() => {
                      setOpen(false);
                      handleAction(a.key);
                    }}
                  >
                    <a.icon className="size-3.5" />
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-fomi-border bg-fomi-surface-2 px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div
        className={cn(
          "mt-0.5 truncate text-xs capitalize text-zinc-100",
          mono && "font-mono normal-case",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-zinc-200">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full fomi-gradient-bg"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
