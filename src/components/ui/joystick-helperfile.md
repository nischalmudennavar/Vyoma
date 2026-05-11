import React, { useState, useRef, useEffect, useCallback } from 'react';

// ==========================================
// 1. REUSABLE SKEUOMORPHIC JOYSTICK COMPONENT
// ==========================================

const Joystick = ({
size = 160,
knobSize = 56,
labels = { top: 'N', bottom: 'S', left: 'W', right: 'E' },
onDrag,
onDragEnd,
title = "CONTROL"
}) => {
const containerRef = useRef(null);
const [isDragging, setIsDragging] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });

// Math constants
const maxRadius = (size / 2) - (knobSize / 2) - 10; // 10px padding from the edge of the well

const handlePointerDown = useCallback((e) => {
e.preventDefault();
setIsDragging(true);
e.target.setPointerCapture(e.pointerId);
}, []);

const handlePointerMove = useCallback((e) => {
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
        y: Number(-(deltaY / maxRadius).toFixed(2))
      });
    }

}, [isDragging, maxRadius, onDrag]);

const handlePointerUp = useCallback((e) => {
setIsDragging(false);
setPosition({ x: 0, y: 0 }); // Snap back to center
if (e.target.hasPointerCapture(e.pointerId)) {
e.target.releasePointerCapture(e.pointerId);
}

    // Reset output to exactly zero on release
    if (onDrag) onDrag({ x: 0, y: 0 });
    if (onDragEnd) onDragEnd();

}, [onDrag, onDragEnd]);

return (
<div className="flex flex-col items-center select-none" style={{ width: size }}>
{/_ Outer Housing / Base Ring _/}
<div
ref={containerRef}
className="relative rounded-full flex items-center justify-center
bg-gradient-to-br from-[#2a2c2e] to-[#111214]
shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.05),_inset_0_0_0_1px_#1f2123]"
style={{ width: size, height: size }} >
{/_ Labels _/}
<div className="absolute top-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">{labels.top}</div>
<div className="absolute bottom-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">{labels.bottom}</div>
<div className="absolute left-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none origin-left -rotate-90">{labels.left}</div>
<div className="absolute right-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none origin-right rotate-90">{labels.right}</div>

        {/* Inner Track / Well */}
        <div
          className="rounded-full bg-[#0d0e10]
                     shadow-[inset_0_6px_15px_rgba(0,0,0,1),_0_1px_0_rgba(255,255,255,0.05)]"
          style={{ width: size * 0.65, height: size * 0.65 }}
        ></div>

        {/* Draggable Knob (The thumbstick) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center
                     bg-gradient-to-b from-[#e5e7eb] to-[#9ca3af]
                     shadow-[0_8px_15px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-3px_5px_rgba(0,0,0,0.3)]
                     hover:brightness-110 transition-[filter] duration-200"
          style={{
            width: knobSize,
            height: knobSize,
            transform: `translate(${position.x}px, ${position.y}px)`,
            touchAction: 'none' // Crucial to stop mobile page scroll while dragging
          }}
        >
          {/* Thumbstick Grip Texture (Concentric circles) */}
          <div className="w-[60%] h-[60%] rounded-full bg-gradient-to-b from-[#b0b5be] to-[#d1d5db] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] flex items-center justify-center">
            <div className="w-[50%] h-[50%] rounded-full bg-gradient-to-b from-[#cbd0d8] to-[#9ca3af] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"></div>
          </div>
        </div>
      </div>

      {/* Control Panel Title */}
      <div className="mt-4 text-[11px] font-extrabold text-gray-400 tracking-[0.3em] uppercase">
        {title}
      </div>
    </div>

);
};

// ==========================================
// 2. DEMO DASHBOARD (VYOMA CONCEPT)
// ==========================================

export default function App() {
const [spatialData, setSpatialData] = useState({ x: 0, y: 0 });
const [temporalData, setTemporalData] = useState({ x: 0, y: 0 });

return (
<div className="min-h-screen bg-[#141517] text-gray-200 font-sans flex flex-col items-center justify-center overflow-hidden">

      {/* Decorative Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <h1 className="relative z-10 text-2xl font-light tracking-[0.4em] mb-12 text-gray-400">
        V Y O M A <span className="font-bold text-white">C O R E</span>
      </h1>

      {/* Main Bottom Control Deck Panel */}
      <div className="relative z-10 w-full max-w-5xl bg-[#1b1d20] border-t border-[#2a2c30] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between p-6 px-12 rounded-t-3xl">

        {/* Left: Spatial Control */}
        <div className="flex flex-col items-center">
          <Joystick
            title="Spatial"
            labels={{ top: 'N', bottom: 'S', left: 'W', right: 'E' }}
            onDrag={setSpatialData}
          />
          <div className="mt-2 text-xs font-mono text-[#00ffcc] opacity-80 bg-black/40 px-3 py-1 rounded">
            X: {spatialData.x > 0 ? '+' : ''}{spatialData.x.toFixed(2)} | Y: {spatialData.y > 0 ? '+' : ''}{spatialData.y.toFixed(2)}
          </div>
        </div>

        {/* Center: Placeholder for Ephemeris Timeline */}
        <div className="flex-1 mx-12 h-32 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-orange-600 via-blue-900 to-black"></div>

          {/* Mock Sine Waves */}
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M 0 50 Q 25 10, 50 50 T 100 50" fill="none" stroke="#fff" strokeWidth="1" />
            <path d="M 0 70 Q 25 90, 50 70 T 100 70" fill="none" stroke="#aaa" strokeWidth="1" />
          </svg>

          {/* Dynamic Playhead simulated by temporal X-axis */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_10px_red] transition-all duration-75"
            style={{ left: `${50 + (temporalData.x * 50)}%` }}
          />

          <span className="relative z-10 text-gray-500 font-mono text-sm uppercase tracking-widest">
            {`< ephemeris-timeline.tsx >`}
          </span>
        </div>

        {/* Right: Temporal Control */}
        <div className="flex flex-col items-center">
          <Joystick
            title="Temporal"
            labels={{ top: '+Time', bottom: '-Time', left: '-Day', right: '+Day' }}
            onDrag={setTemporalData}
          />
           <div className="mt-2 text-xs font-mono text-[#ffaa00] opacity-80 bg-black/40 px-3 py-1 rounded">
            Day: {temporalData.x > 0 ? '+' : ''}{temporalData.x.toFixed(2)} | Hr: {temporalData.y > 0 ? '+' : ''}{temporalData.y.toFixed(2)}
          </div>
        </div>

      </div>

    </div>

);
}
