"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVyomaSelector } from "@/store/use-vyoma-store";

interface DraggablePanelProps {
  id: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  className?: string;
}

export function DraggablePanel({
  id,
  children,
  defaultPosition = { x: 24, y: 24 },
  className,
}: DraggablePanelProps) {
  const { panelPositions, panelsLocked } = useVyomaSelector([
    "panelPositions",
    "panelsLocked",
  ]);
  const position = panelPositions[id] || defaultPosition;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: panelsLocked,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: position.x,
    top: position.y,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "fixed z-20 transition-shadow",
        isDragging && "shadow-2xl z-30",
        className,
      )}
    >
      {!panelsLocked && (
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-0.5 cursor-grab active:cursor-grabbing flex items-center gap-1 shadow-md hover:bg-primary/90 transition-colors"
        >
          <GripHorizontal className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-tighter">
            Drag
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
