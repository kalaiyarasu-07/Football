"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Radar, X } from "lucide-react";
import PlayerSelector from "@/components/PlayerSelector";
import SeasonSelector from "@/components/SeasonSelector";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/players", label: "Players" },
  { href: "/shots", label: "Shot History" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Radar className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-white">
              ShotVision
            </span>
            <span className="text-[11px] font-medium text-muted">
              Football Shot Analytics
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-surface-light hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop selectors */}
        <div className="hidden items-center gap-3 md:flex">
          <SeasonSelector className="w-40" />
          <PlayerSelector className="w-48" />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg border border-surface-border p-2 text-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-surface-border bg-background px-4 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:bg-surface-light hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <SeasonSelector />
            <PlayerSelector />
          </div>
        </div>
      )}
    </header>
  );
}
