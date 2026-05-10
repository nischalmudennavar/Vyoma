"use client";
import { Container } from "@/components/container";

/**
 * Global application header.
 * Uses the Container component for centralized UI opacity control.
 */
export function Header() {
  return (
    <Container
      applyUiOpacity
      as="header"
      className="flex w-full items-center justify-center border-b px-6 py-6 shrink-0 z-10 bg-background/80 backdrop-blur-xl relative"
    >
      <div className="logo-container py-3 px-10 w-fit h-fit absolute border bg-background/80 border-t-0 backdrop-blur-xl top-9 ">
        <h1 className="text-xl font-bold tracking-tight uppercase">Vyoma</h1>
      </div>
    </Container>
  );
}
