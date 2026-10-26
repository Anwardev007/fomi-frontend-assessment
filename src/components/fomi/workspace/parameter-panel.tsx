"use client";

import { useState } from "react";
import { Check, ChevronDown, Dices, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useFomiStore } from "@/components/fomi/store";
import {
  ASPECT_RATIOS,
  MODELS,
  STYLES,
  type AspectRatio,
  type FomiModel,
  type FomiStyle,
} from "@/components/fomi/types";
import { cn } from "@/lib/utils";

export function ParameterPanel() {
  const model = useFomiStore((s) => s.model);
  const setModel = useFomiStore((s) => s.setModel);
  const style = useFomiStore((s) => s.style);
  const setStyle = useFomiStore((s) => s.setStyle);
  const aspectRatio = useFomiStore((s) => s.aspectRatio);
  const setAspectRatio = useFomiStore((s) => s.setAspectRatio);
  const guidance = useFomiStore((s) => s.guidance);
  const setGuidance = useFomiStore((s) => s.setGuidance);
  const steps = useFomiStore((s) => s.steps);
  const setSteps = useFomiStore((s) => s.setSteps);
  const seed = useFomiStore((s) => s.seed);
  const setSeed = useFomiStore((s) => s.setSeed);
  const negativePrompt = useFomiStore((s) => s.negativePrompt);
  const setNegativePrompt = useFomiStore((s) => s.setNegativePrompt);
  const batch = useFomiStore((s) => s.batch);
  const setBatch = useFomiStore((s) => s.setBatch);

  const [advancedOpen, setAdvancedOpen] = useState(true);

  const randomSeed = () => setSeed(String(Math.floor(Math.random() * 1_000_000)));

  return (
    <div className="flex h-full flex-col">
      <Scrollable>
        {/* Model selector */}
        <Section title="Model">
          <div className="space-y-1.5">
            {MODELS.map((m) => {
              const active = m.id === model;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id as FomiModel)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left transition-colors",
                    active
                      ? "border-fomi-accent/60 bg-fomi-accent/10"
                      : "border-fomi-border bg-fomi-surface-2 hover:border-zinc-600",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                      active ? "border-fomi-accent bg-fomi-accent" : "border-zinc-600",
                    )}
                  >
                    {active && <Check className="size-2.5 text-white" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-zinc-100">
                        {m.name}
                      </span>
                      {m.badge && (
                        <Badge className="bg-fomi-accent/20 px-1 py-0 text-[9px] font-normal text-fomi-accent-3">
                          {m.badge}
                        </Badge>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-zinc-500">
                      {m.tagline}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Style picker */}
        <Section title="Style">
          <div className="grid grid-cols-2 gap-1.5">
            {STYLES.map((s) => {
              const active = s.id === style;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id as FomiStyle)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-left text-xs transition-colors",
                    active
                      ? "border-fomi-accent/60 bg-fomi-accent/10 text-zinc-100"
                      : "border-fomi-border bg-fomi-surface-2 text-zinc-400 hover:text-zinc-100",
                  )}
                >
                  <span className="text-sm leading-none">{s.emoji}</span>
                  <span className="truncate">{s.name}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Aspect ratio */}
        <Section title="Aspect ratio">
          <div className="grid grid-cols-3 gap-1.5">
            {ASPECT_RATIOS.map((ar) => {
              const active = ar.id === aspectRatio;
              return (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id as AspectRatio)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md border p-2 transition-colors",
                    active
                      ? "border-fomi-accent/60 bg-fomi-accent/10"
                      : "border-fomi-border bg-fomi-surface-2 hover:border-zinc-600",
                  )}
                  aria-pressed={active}
                  title={`${ar.label} (${ar.id})`}
                >
                  <span
                    className={cn(
                      "block rounded-sm border",
                      active ? "border-fomi-accent-3" : "border-zinc-500",
                    )}
                    style={{
                      width: `${18 * Math.min(ar.w / ar.h, 1)}px`,
                      height: `${18 * Math.min(ar.h / ar.w, 1)}px`,
                    }}
                  />
                  <span
                    className={cn(
                      "font-mono text-[10px]",
                      active ? "text-zinc-100" : "text-zinc-500",
                    )}
                  >
                    {ar.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Batch count */}
        <Section title="Batch count">
          <div className="grid grid-cols-4 gap-1.5">
            {([1, 2, 3, 4] as const).map((n) => {
              const active = n === batch;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBatch(n)}
                  className={cn(
                    "rounded-md border py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-fomi-accent/60 bg-fomi-accent/10 text-zinc-100"
                      : "border-fomi-border bg-fomi-surface-2 text-zinc-400 hover:text-zinc-100",
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Advanced */}
        <Collapsible
          open={advancedOpen}
          onOpenChange={setAdvancedOpen}
          className="border-t border-fomi-border"
        >
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <SlidersHorizontal className="size-3.5 text-zinc-400" />
                Advanced
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-zinc-500 transition-transform",
                  advancedOpen && "rotate-180",
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 px-3 pb-4">
              {/* Guidance */}
              <ParamRow
                label="Guidance"
                value={guidance.toFixed(1)}
              >
                <Slider
                  value={[guidance]}
                  onValueChange={(v) => setGuidance(v[0])}
                  min={1}
                  max={20}
                  step={0.5}
                  className="[&_[data-slot=slider-range]]:fomi-gradient-bg"
                />
                <div className="flex justify-between text-[9px] text-zinc-600">
                  <span>1.0 · creative</span>
                  <span>20.0 · strict</span>
                </div>
              </ParamRow>

              {/* Steps */}
              <ParamRow label="Steps" value={`${steps}`}>
                <Slider
                  value={[steps]}
                  onValueChange={(v) => setSteps(v[0])}
                  min={10}
                  max={50}
                  step={1}
                  className="[&_[data-slot=slider-range]]:fomi-gradient-bg"
                />
                <div className="flex justify-between text-[9px] text-zinc-600">
                  <span>10 · fast</span>
                  <span>50 · max</span>
                </div>
              </ParamRow>

              {/* Seed */}
              <ParamRow label="Seed">
                <div className="flex gap-1.5">
                  <Input
                    value={seed}
                    onChange={(e) =>
                      setSeed(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))
                    }
                    placeholder="Random"
                    inputMode="numeric"
                    className="h-8 border-fomi-border bg-fomi-surface-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:border-fomi-accent/50"
                  />
                  <button
                    type="button"
                    onClick={randomSeed}
                    className="grid size-8 shrink-0 place-items-center rounded-md border border-fomi-border bg-fomi-surface-2 text-zinc-400 transition-colors hover:text-zinc-100"
                    aria-label="Random seed"
                    title="Randomize seed"
                  >
                    <Dices className="size-3.5" />
                  </button>
                </div>
              </ParamRow>

              {/* Negative prompt */}
              <ParamRow label="Negative prompt">
                <Textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, lowres, watermark, extra fingers…"
                  rows={2}
                  className="resize-none border-fomi-border bg-fomi-surface-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:border-fomi-accent/50"
                />
              </ParamRow>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Scrollable>
    </div>
  );
}

function Scrollable({ children }: { children: React.ReactNode }) {
  return (
    <div className="fomi-scroll flex-1 overflow-y-auto">
      <div className="divide-y divide-fomi-border">{children}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 py-3">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      {children}
    </div>
  );
}

function ParamRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-zinc-300">{label}</span>
        {value && (
          <span className="font-mono text-[11px] text-fomi-accent-3">{value}</span>
        )}
      </div>
      {children}
    </div>
  );
}
