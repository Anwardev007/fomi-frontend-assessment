"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFomiStore, scrollToWorkspace } from "@/components/fomi/store";
import type { AspectRatio, FomiStyle } from "@/components/fomi/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TemplateItem {
  id: string;
  name: string;
  prompt: string;
  style: FomiStyle;
  aspectRatio: AspectRatio;
  thumb: string;
}
interface TemplateCategory {
  id: string;
  label: string;
  items: TemplateItem[];
}
interface TemplatesResponse {
  categories: TemplateCategory[];
}

async function fetchTemplates(): Promise<TemplatesResponse> {
  const res = await fetch("/api/templates");
  if (!res.ok) throw new Error("Failed to load templates");
  return (await res.json()) as TemplatesResponse;
}

export function TemplatesSection() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  const setPrompt = useFomiStore((s) => s.setPrompt);
  const setStyle = useFomiStore((s) => s.setStyle);
  const setAspectRatio = useFomiStore((s) => s.setAspectRatio);

  const categories = data?.categories ?? [];

  const apply = (t: TemplateItem) => {
    setPrompt(t.prompt);
    setStyle(t.style);
    setAspectRatio(t.aspectRatio);
    toast.success("Template applied", {
      description: t.name,
    });
    scrollToWorkspace();
  };

  return (
    <section
      id="templates"
      aria-labelledby="templates-heading"
      className="relative py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fomi-accent">Templates</p>
          <h2
            id="templates-heading"
            className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Start from a proven starting point.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Curated presets tuned by Fomi&apos;s creative team. One click loads
            the prompt, style, and ratio into the workspace.
          </p>
        </div>

        {isPending ? (
          <div className="mt-10 flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="ml-2 text-sm">Loading templates…</span>
          </div>
        ) : isError ? (
          <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            Couldn&apos;t load templates.
          </div>
        ) : (
          <Tabs defaultValue={categories[0]?.id} className="mt-10">
            <TabsList className="h-auto flex-wrap gap-1 bg-muted/60 p-1">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.id}
                  value={c.id}
                  className="rounded-md px-4 py-1.5 text-sm"
                >
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((c) => (
              <TabsContent key={c.id} value={c.id} className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {c.items.map((t, i) => (
                    <motion.button
                      key={t.id}
                      type="button"
                      onClick={() => apply(t)}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="group relative overflow-hidden rounded-xl border border-border/70 bg-card text-left transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                          src={t.thumb}
                          alt={t.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <p className="text-sm font-medium text-white">
                            {t.name}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/70">
                            {t.prompt}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "absolute right-2 top-2 flex translate-y-1 items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                          )}
                        >
                          Use template
                          <ArrowRight className="size-3" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {t.aspectRatio}
                        </Badge>
                        <span className="text-[11px] capitalize text-muted-foreground">
                          {t.style.replace("-", " ")}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
}
