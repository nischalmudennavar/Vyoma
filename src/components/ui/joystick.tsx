"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface JoystickProps {
  size?: number;
  knobSize?: number;
  labels?: { top: string; bottom: string; left: string; right: string };
  onDrag?: (position: { x: number; y: number }) => void;
  onDragEnd?: () => void;
  title?: string;
  className?: string;
}

export function Joystick({
  size = 160,
  knobSize = 56,
  labels = { top: "N", bottom: "S", left: "W", right: "E" },
  onDrag,
  onDragEnd,
  title = "CONTROL",
  className,
}: JoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Math constants
  const maxRadius = size / 2 - knobSize / 2 - 10; // 10px padding from the edge of the well

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = e.clientX - centerX;
      let deltaY = e.clientY - centerY;

      // Calculate distance from center
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Clamp the knob strictly within the circular boundary
      if (distance > maxRadius) {
        const ratio = maxRadius / distance;
        deltaX *= ratio;
        deltaY *= ratio;
      }

      setPosition({ x: deltaX, y: deltaY });

      // Normalize output vector (-1.0 to 1.0). Invert Y so UP is positive.
      if (onDrag) {
        onDrag({
          x: Number((deltaX / maxRadius).toFixed(2)),
          y: Number(-(deltaY / maxRadius).toFixed(2)),
        });
      }
    },
    [isDragging, maxRadius, onDrag],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      setPosition({ x: 0, y: 0 }); // Snap back to center
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      // Reset output to exactly zero on release
      if (onDrag) onDrag({ x: 0, y: 0 });
      if (onDragEnd) onDragEnd();
    },
    [onDrag, onDragEnd],
  );

  return (
    <div className={cn("flex flex-col items-center select-none", className)} style={{ width: size }}>
      {/* Outer Housing / Base Ring */}
      <div
        ref={containerRef}
        className="relative rounded-full flex items-center justify-center bg-gradient-to-br from-[#2a2c2e] to-[#111214] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.05),_inset_0_0_0_1px_#1f2123]"
        style={{ width: size, height: size }}
      >
        {/* Labels */}
        <div className="absolute top-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">
          {labels.top}
        </div>
        <div className="absolute bottom-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">
          {labels.bottom}
        </div>
        <div className="absolute left-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none origin-left -rotate-90">
          {labels.left}
        </div>
        <div className="absolute right-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none origin-right rotate-90">
          {labels.right}
        </div>

        {/* Inner Track / Well */}
        <div
          className="rounded-full bg-[#0d0e10] shadow-[inset_0_6px_15px_rgba(0,0,0,1),_0_1px_0_rgba(255,255,255,0.05)]"
          style={{ width: size * 0.65, height: size * 0.65 }}
        ></div>

        {/* Draggable Knob (The thumbstick) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center bg-gradient-to-b from-[#e5e7eb] to-[#9ca3af] shadow-[0_8px_15px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-3px_5px_rgba(0,0,0,0.3)] hover:brightness-110 transition-[filter] duration-200"
          style={{
            width: knobSize,
            height: knobSize,
            transform: `translate(${position.x}px, ${position.y}px)`,
            touchAction: "none", // Crucial to stop mobile page scroll while dragging
          }}
        >
          {/* Thumbstick Grip Texture (Concentric circles) */}
          <div className="w-[60%] h-[60%] rounded-full bg-gradient-to-b from-[#b0b5be] to-[#d1d5db] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] flex items-center justify-center pointer-events-none">
            <div className="w-[50%] h-[50%] rounded-full bg-gradient-to-b from-[#cbd0d8] to-[#9ca3af] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Control Panel Title */}
      {title && (
        <div className="mt-4 text-[11px] font-extrabold text-gray-400 tracking-[0.3em] uppercase">
          {title}
        </div>
      )}
    </div>
  );
}
