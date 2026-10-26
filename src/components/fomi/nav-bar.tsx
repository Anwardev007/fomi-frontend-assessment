"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { scrollToWorkspace } from "@/components/fomi/store";

const LINKS = [
  { label: "Showcase", href: "#showcase" },
  { label: "Templates", href: "#templates" },
  { label: "Workspace", href: "#workspace", onClick: scrollToWorkspace },
  { label: "Pricing", href: "#pricing" },
] as const;

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6"
      >
        <a
          href="#top"
          className="group flex items-center gap-2"
          aria-label="Fomi home"
        >
          <span className="relative grid size-8 place-items-center rounded-lg fomi-gradient-bg shadow-lg shadow-fomi-accent/30">
            <Sparkles className="size-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            <span className="fomi-gradient-text">Fomi</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={l.onClick}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Sign in
          </Button>
          <Button
            size="sm"
            onClick={scrollToWorkspace}
            className="fomi-gradient-bg border-0 text-white shadow-md shadow-fomi-accent/30 hover:opacity-90"
          >
            Start creating
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetTitle className="px-4 pt-4">
              <span className="fomi-gradient-text">Fomi</span>
            </SheetTitle>
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => {
                    setOpen(false);
                    if (l.onClick) {
                      e.preventDefault();
                      l.onClick();
                    }
                  }}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
                <Button
                  className="w-full fomi-gradient-bg border-0 text-white"
                  onClick={() => {
                    setOpen(false);
                    scrollToWorkspace();
                  }}
                >
                  Start creating
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-fomi-accent/40 to-transparent"
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
