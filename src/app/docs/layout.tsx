"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DocsPager } from "@/components/layout/docs-pager";
import { Button } from "@/components/ui/button";
import { DocsSidebar } from "@/components/layout/docs-sidebar";

/**
 * Documentation layout component.
 * Provides a sticky header and a sidebar with navigation.
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="h-14 border-b border-border/40 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-6 bg-primary group-hover:scale-110 transition-transform" />
          <span className="font-black uppercase tracking-tighter">
            Vyoma / Docs
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-none hover:bg-primary/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 hidden md:block">
          <DocsSidebar />
        </aside>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-14 z-40 md:hidden bg-background">
            <DocsSidebar
              onItemClick={() => setIsMobileMenuOpen(false)}
              className="border-r-0"
            />
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl mx-auto py-12 px-8">
            <div className="max-w-none">{children}</div>
            <DocsPager />
          </div>
        </main>
      </div>
    </div>
  );
}
