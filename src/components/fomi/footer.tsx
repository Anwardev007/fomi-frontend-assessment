"use client";

import { Github, Sparkles, Twitter, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: ["Workspace", "Showcase", "Templates", "Pricing", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Docs", "Prompt guide", "API reference", "Community", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Content policy", "Licenses", "DMCA"],
  },
] as const;

const SOCIALS = [
  { label: "Twitter", icon: Twitter },
  { label: "GitHub", icon: Github },
  { label: "YouTube", icon: Youtube },
] as const;

export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-border/60 bg-background"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_3fr]">
          <div>
            <a href="#top" className="flex items-center gap-2" aria-label="Fomi home">
              <span className="grid size-8 place-items-center rounded-lg fomi-gradient-bg">
                <Sparkles className="size-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                <span className="fomi-gradient-text">Fomi</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The AI creative platform for professional image &amp; video
              generation. Built for creators who ship.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-fomi-accent/40 hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Fomi Labs, Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted for creators, with
            <span className="fomi-gradient-text font-medium">Fomi v2 Pro</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
