"use client";
import { Container } from "@/components/layout/container";
import { MobileDrawer } from "./mobile-drawer";
// import { Settings2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useVyomaStore } from "@/store/use-vyoma-store";

/**
 * Global application header.
 * Uses the Container component for centralized UI opacity control.
 */
export function Header() {
  // const { toggleSettings } = useVyomaStore();

  return (
    <Container
      applyUiOpacity
      as="header"
      className="absolute top-0  left-0 w-full flex items-center flex-col justify-between  z-50 pointer-events-none"
    >
      <div className="header-element  w-full block"></div>
      <div className="flex items-center gap-4 flex-1 pointer-events-auto">
        <div className="md:hidden">
          <MobileDrawer />
        </div>
      </div>

      <div className="pointer-events-auto bg-background logo-container relative -top-2">
        <h1 className="text-2xl  font-black tracking-[0.3em] uppercase ">
          Vyoma
        </h1>
      </div>

      <div className="flex items-center gap-6 ml-auto flex-1 justify-end pointer-events-auto">
        {/* <div className="hidden md:flex items-center gap-3 px-4 py-2 border border-foreground/10 backdrop-blur-md bg-background/5 pointer-events-none select-none">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">
            Search
          </span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 text-[10px] font-mono font-bold">
              ⌘
            </kbd>
            <kbd className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 text-[10px] font-mono font-bold">
              K
            </kbd>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSettings}
          className="rounded-none hover:bg-foreground/10 transition-colors border border-foreground/5 backdrop-blur-md"
          title="Settings"
        >
          <Settings2 className="w-4 h-4" />
        </Button> */}
      </div>
    </Container>
  );
}
