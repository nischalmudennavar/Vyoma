"use client";
import { Container } from "@/components/layout/container";
import { MobileDrawer } from "./mobile-drawer";

/**
 * Global application header.
 * Uses the Container component for centralized UI opacity control.
 */
export function Header() {
  return (
    <Container
      applyUiOpacity
      as="header"
      className="flex w-full items-center justify-between px-6 py-6 shrink-0 z-10 bg-background/80 backdrop-blur-xl relative h-16"
    >
      <div className="md:hidden">
        <MobileDrawer />
      </div>

      <div className="logo-container py-3 px-10 w-fit h-fit absolute border bg-background/80 border-t-0 backdrop-blur-xl top-0 left-1/2 -translate-x-1/2">
        <h1 className="text-xl font-bold tracking-tight uppercase">Vyoma</h1>
      </div>

      <div className="hidden md:flex ml-auto items-center gap-2 px-3 py-1.5 border border-border bg-muted/30 pointer-events-none select-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Search</span>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-background border border-border text-[10px] font-mono font-bold">⌘</kbd>
          <kbd className="px-1.5 py-0.5 bg-background border border-border text-[10px] font-mono font-bold">K</kbd>
        </div>
      </div>
    </Container>
  );
}
