"use client";

import { motion } from "framer-motion";
import {
  Brush,
  Clapperboard,
  LayoutTemplate,
  Maximize2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    icon: Wand2,
    title: "Text to Image",
    description:
      "Compose prompts with style presets, aspect ratios, and reference images. Get four production-ready variants per run.",
    accent: "from-amber-400/20 to-rose-500/10",
  },
  {
    icon: Brush,
    title: "AI Editing",
    description:
      "Inpaint, expand, and restyle with brush-aware masks. Edit a region without rerolling the whole frame.",
    accent: "from-rose-500/20 to-fuchsia-500/10",
  },
  {
    icon: Clapperboard,
    title: "Text to Video",
    description:
      "Generate short clips with camera moves, anamorphic flares, and consistent characters across shots.",
    accent: "from-fuchsia-500/20 to-violet-500/10",
  },
  {
    icon: Maximize2,
    title: "Upscaling",
    description:
      "Push any variant to 4K with detail-preserving super-resolution. No mushy blur, no plastic skin.",
    accent: "from-amber-400/20 to-fuchsia-500/10",
  },
  {
    icon: LayoutTemplate,
    title: "Templates",
    description:
      "Start from curated presets — cinematic portraits, product shots, anime key visuals — and make them yours.",
    accent: "from-rose-500/20 to-amber-400/10",
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-fomi-accent">Capabilities</p>
          <h2
            id="features-heading"
            className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl"
          >
            One canvas, every modality.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fomi unifies the tools professional creators jump between every day
            — so you stay in flow.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 transition-transform duration-300 hover:-translate-y-1",
                i === 0 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                  f.accent,
                )}
              />
              <div className="relative">
                <div className="grid size-11 place-items-center rounded-xl border border-border/60 bg-background/60">
                  <f.icon className="size-5 text-fomi-accent" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </motion.article>
          ))}

          {/* CTA tile */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: FEATURES.length * 0.06 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl fomi-gradient-bg p-6 text-white"
          >
            <div className="relative">
              <h3 className="text-lg font-semibold">And more in the workspace.</h3>
              <p className="mt-2 text-sm text-white/85">
                Variations, seed control, negative prompts, batch generation,
                and a history you can rewind.
              </p>
            </div>
            <a
              href="#workspace"
              className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/25"
            >
              Explore the workspace
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
