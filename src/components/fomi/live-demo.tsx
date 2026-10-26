"use client";

import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, ImageIcon, Loader2, Wand2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { GenerateResponse } from "@/components/fomi/types";
import { cn } from "@/lib/utils";

async function generate(payload: {
  prompt: string;
}): Promise<GenerateResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      prompt: payload.prompt,
      model: "fomi-v2-pro",
      aspectRatio: "1:1",
      style: "cinematic",
      count: 4,
    }),
  });
  if (!res.ok) throw new Error("Generation failed");
  return (await res.json()) as GenerateResponse;
}

export function LiveDemo() {
  const [prompt, setPrompt] = useState("");

  const mutation = useMutation({
    mutationFn: generate,
    onSuccess: (data) => {
      toast.success(`Generated ${data.variants.length} variants`, {
        description: `${data.latencyMs}ms · Fomi v2 Pro`,
      });
    },
    onError: () => {
      toast.error("Generation failed", {
        description: "Something went wrong. Try again in a moment.",
      });
    },
  });

  const submit = () => {
    if (!prompt.trim()) return;
    mutation.mutate({ prompt });
  };

  const variants = mutation.data?.variants ?? [];
  const loading = mutation.isPending;

  return (
    <section
      aria-labelledby="live-demo-heading"
      className="relative py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 md:p-10 fomi-ring">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            {/* Left: copy + input */}
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live demo · no sign-up
              </span>
              <h2
                id="live-demo-heading"
                className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl"
              >
                See it make something.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Type any prompt and Fomi returns four variants in seconds. This
                runs against the same engine as the workspace below.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="mt-6 flex flex-col gap-2"
              >
                <label htmlFor="demo-prompt" className="sr-only">
                  Prompt
                </label>
                <textarea
                  id="demo-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A bioluminescent jellyfish drifting through a moonlit ocean…"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus-visible:border-fomi-accent/50 focus-visible:ring-2 focus-visible:ring-fomi-accent/20"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {prompt.length} chars
                  </span>
                  <Button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="fomi-gradient-bg border-0 text-white shadow-md shadow-fomi-accent/30 hover:opacity-90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      <>
                        <Wand2 className="size-4" />
                        Generate 4 variants
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right: results */}
            <div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted fomi-shimmer"
                      >
                        <Skeleton className="absolute inset-0 rounded-xl" />
                      </div>
                    ))
                  : variants.length > 0
                    ? variants.map((v, i) => (
                        <motion.div
                          key={v.id}
                          initial={{ opacity: 0, scale: 0.96, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: i * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted"
                        >
                          <Image
                            src={v.url}
                            alt={v.prompt}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <p className="truncate text-[11px] font-mono text-white/80">
                              seed · {v.seed}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    : // Empty state
                      Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex aspect-square items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/40",
                          )}
                        >
                          <ImageIcon className="size-5 text-muted-foreground/40" />
                        </div>
                      ))}
              </div>

              {mutation.isError && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-medium">Generation failed</p>
                    <p className="text-xs opacity-90">
                      The mock endpoint returned an error. Please try again.
                    </p>
                  </div>
                </div>
              )}

              {variants.length > 0 && !loading && (
                <p className="mt-3 text-right text-xs text-muted-foreground">
                  {mutation.data?.latencyMs}ms · request{" "}
                  <span className="font-mono">
                    {mutation.data?.requestId.slice(0, 18)}…
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
