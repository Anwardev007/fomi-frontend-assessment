"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, Heart, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { GalleryItem } from "@/components/fomi/types";
import { cn } from "@/lib/utils";

interface GalleryResponse {
  items: GalleryItem[];
}

async function fetchGallery(): Promise<GalleryResponse> {
  const res = await fetch("/api/gallery");
  if (!res.ok) throw new Error("Failed to load gallery");
  return (await res.json()) as GalleryResponse;
}

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

export function ShowcaseGallery() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGallery,
  });
  const [active, setActive] = useState<GalleryItem | null>(null);

  const items = data?.items ?? [];

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="relative py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-fomi-accent">Showcase</p>
            <h2
              id="showcase-heading"
              className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Made with Fomi, by the community.
            </h2>
            <p className="mt-3 text-muted-foreground">
              A live feed of creations from Fomi creators. Hover for the prompt,
              click for the full view.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="size-3 text-fomi-accent" />
            {items.length} featured
          </Badge>
        </div>

        {isPending ? (
          <div className="mt-10 flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="ml-2 text-sm">Loading showcase…</span>
          </div>
        ) : isError ? (
          <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            Couldn&apos;t load the showcase. Please refresh.
          </div>
        ) : (
          <div
            className="mt-10 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4"
            style={{ columnGap: "1rem" }}
          >
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: (i % 8) * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative mb-4 block w-full overflow-hidden rounded-xl border border-border/60 bg-muted text-left break-inside-avoid"
                aria-label={`View creation by ${item.author}: ${item.prompt}`}
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.thumbUrl}
                    alt={item.prompt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <p className="line-clamp-2 text-xs leading-snug text-white/90">
                      {item.prompt}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-white/70">
                      <span className="font-medium text-white/90">
                        @{item.author}
                      </span>
                      <span className="flex items-center gap-2.5">
                        <span className="flex items-center gap-1">
                          <Heart className="size-3" />
                          {fmt(item.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="size-3" />
                          {fmt(item.views)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "absolute left-2 top-2 bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100",
                    )}
                  >
                    {item.style}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
          {active && (
            <>
              <DialogTitle className="sr-only">
                Creation by {active.author}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {active.prompt}
              </DialogDescription>
              <div className="grid md:grid-cols-[1.4fr_1fr]">
                <div className="relative aspect-square md:aspect-auto">
                  <Image
                    src={active.url}
                    alt={active.prompt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <div className="grid size-8 place-items-center rounded-full fomi-gradient-bg text-xs font-semibold text-white">
                      {active.author[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">@{active.author}</p>
                      <p className="text-xs text-muted-foreground">Fomi creator</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="font-mono">
                      {active.model}
                    </Badge>
                    <Badge variant="outline">{active.style}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {active.prompt}
                  </p>
                  <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Heart className="size-4" /> {fmt(active.likes)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="size-4" /> {fmt(active.views)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
