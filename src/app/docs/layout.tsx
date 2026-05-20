"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarNavItems } from "@/lib/docs-config";
import { DocsPager } from "@/components/layout/docs-pager";
import { Button } from "@/components/ui/button";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <div className="py-8 px-6 space-y-10">
      {sidebarNavItems.map((group) => (
        <div key={group.title} className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 px-3">
            {group.title}
          </h4>
          <nav className="flex flex-col space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center h-9 px-3 text-xs font-bold transition-all duration-200 relative",
                    "hover:bg-primary/5 cursor-pointer",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-foreground" />
                  )}
                  <span className="relative z-10 uppercase tracking-tight">
                    {item.title}
                  </span>
                  {!isActive && (
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="size-1.5 bg-primary" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="h-14 border-b border-border/40 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-6 bg-primary" />
          <span className="font-black uppercase tracking-tighter">Vyoma / Docs</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 border-r border-border/40 hidden md:block">
          <ScrollArea className="h-full">
            <NavContent />
          </ScrollArea>
        </aside>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-14 z-40 md:hidden bg-background">
            <ScrollArea className="h-full">
              <NavContent />
            </ScrollArea>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto py-12 px-8">
            {children}
            <DocsPager />
          </div>
        </main>
      </div>
    </div>
  );
}
