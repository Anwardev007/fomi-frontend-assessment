"use client";

import dynamic from "next/dynamic";
import { NavBar } from "@/components/fomi/nav-bar";
import { Hero } from "@/components/fomi/hero";
import { LiveDemo } from "@/components/fomi/live-demo";
import { Features } from "@/components/fomi/features";
import { ShowcaseGallery } from "@/components/fomi/showcase-gallery";
import { TemplatesSection } from "@/components/fomi/templates-section";
import { StatsSection } from "@/components/fomi/stats-section";
import { CtaSection } from "@/components/fomi/cta-section";
import { Footer } from "@/components/fomi/footer";

// The workspace is the heaviest, most interactive part of the page (localStorage,
// TanStack Query mutation, framer-motion, dialogs). Code-split it with ssr:false
// so the marketing page above ships first and the workspace hydrates on its own.
const Workspace = dynamic(
  () => import("@/components/fomi/workspace").then((m) => m.Workspace),
  {
    ssr: false,
    loading: () => <WorkspaceSkeleton />,
  },
);

function WorkspaceSkeleton() {
  return (
    <section
      id="workspace"
      className="fomi-workspace min-h-[600px] border-t border-fomi-border"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-center px-6 py-32">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <div className="size-8 animate-spin rounded-full border-2 border-zinc-700 border-t-fomi-accent-3" />
          <p className="text-sm">Loading workspace…</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main id="main" className="flex-1">
        <Hero />
        <LiveDemo />
        <Features />
        <ShowcaseGallery />
        <TemplatesSection />
        <StatsSection />
        <CtaSection />
        <Workspace />
      </main>
      <Footer />
    </div>
  );
}
