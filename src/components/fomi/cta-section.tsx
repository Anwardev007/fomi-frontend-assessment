"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToWorkspace } from "@/components/fomi/store";

export function CtaSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="cta-heading"
      className="relative py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl fomi-gradient-bg p-10 text-center text-white md:p-16"
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 45%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <h2
              id="cta-heading"
              className="text-balance text-3xl font-semibold tracking-tight md:text-5xl"
            >
              Start creating today.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/85 md:text-lg">
              Free to start. No credit card. Generate your first image in under
              a minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={scrollToWorkspace}
                className="bg-white text-fomi-accent shadow-lg hover:bg-white/90"
              >
                Open the workspace
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                View pricing
              </Button>
            </div>
            <p className="mt-6 text-xs text-white/70">
              12M+ images generated · 180K creators · 4.9★ rating
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
