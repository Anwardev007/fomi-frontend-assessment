"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sub: string;
}

const STATS: Stat[] = [
  { value: 12, suffix: "M+", label: "Images generated", sub: "across every plan" },
  { value: 180, suffix: "K", label: "Active creators", sub: "shipping every week" },
  { value: 49, prefix: "4.", label: "Avg. creator rating", sub: "from 28k reviews" },
  { value: 96, suffix: "%", label: "First-prompt success", sub: "no reroll needed" },
];

function Counter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setDisplay(Math.round(v).toString());
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="absolute inset-0 -z-10 fomi-grid opacity-40" aria-hidden />
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 md:p-12 fomi-ring">
          <div className="absolute -left-20 -top-20 size-72 rounded-full bg-fomi-accent/10 blur-3xl" aria-hidden />
          <h2 id="stats-heading" className="sr-only">
            Fomi by the numbers
          </h2>
          <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center md:text-left"
              >
                <div className="text-4xl font-semibold tracking-tight md:text-5xl">
                  <span className="fomi-gradient-text">
                    <Counter
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                    />
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
