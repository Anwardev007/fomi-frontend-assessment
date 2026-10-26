"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useFomiStore, scrollToWorkspace } from "@/components/fomi/store";
import { SAMPLE_PROMPTS } from "@/components/fomi/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "12M+", label: "images generated" },
  { value: "180K", label: "creators" },
  { value: "4.9★", label: "creator rating" },
  { value: "120ms", label: "median latency" },
];

export function Hero() {
  const prompt = useFomiStore((s) => s.prompt);
  const setPrompt = useFomiStore((s) => s.setPrompt);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setPrompt(SAMPLE_PROMPTS[0]);
    }
    scrollToWorkspace();
  };

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      <div className="fomi-aurora" aria-hidden="true" />
      <div className="fomi-aurora-3" aria-hidden="true" />
      <div className="absolute inset-0 fomi-grid opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-fomi-accent" />
            Now shipping Fomi v2 Pro — 4K-ready, 2× faster
          </span>

          <h1
            id="hero-heading"
            className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
          >
            Turn imagination
            <br className="hidden sm:block" /> into{" "}
            <span className="fomi-gradient-text">images.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Fomi is the AI creative platform for professional image & video
            generation. Compose a prompt, steer the model, and ship
            production-ready visuals in minutes.
          </p>

          {/* Prompt composer */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-border/70 bg-background/80 p-2 shadow-xl shadow-fomi-accent/5 backdrop-blur sm:flex-row sm:items-center"
          >
            <label htmlFor="hero-prompt" className="sr-only">
              Describe what you want to create
            </label>
            <input
              id="hero-prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk samurai on a neon rooftop at midnight…"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <Button
              type="submit"
              className="fomi-gradient-bg shrink-0 border-0 text-white shadow-md shadow-fomi-accent/30 hover:opacity-90"
            >
              Generate
              <ArrowRight className="size-4" />
            </Button>
          </motion.form>

          {/* Sample prompts */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {SAMPLE_PROMPTS.slice(0, 4).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPrompt(p);
                  scrollToWorkspace();
                }}
                className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-fomi-accent/40 hover:text-foreground"
              >
                {p.split(",")[0]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust stats */}
        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col items-center gap-1 bg-background/80 px-4 py-5 backdrop-blur",
              )}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {s.value}
                </span>
                {s.value.includes("★") && (
                  <Star className="size-4 fill-fomi-accent-3 text-fomi-accent-3" />
                )}
              </dd>
              <dd className="text-xs text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
