"use client";

import { useState, useEffect, useRef } from "react";
import { X, Activity } from "lucide-react";

interface SystemStatusProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemStatus({ isOpen, onClose }: SystemStatusProps) {
  // Set default position to top-right corner
  const getDefaultPosition = () => {
    if (typeof window !== 'undefined') {
      return { x: window.innerWidth - 450, y: 80 };
    }
    return { x: 100, y: 100 };
  };
  
  const [position, setPosition] = useState(getDefaultPosition());
  const [size, setSize] = useState({ width: 420, height: 620 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<"tl" | "tr" | "bl" | "br" | "t" | "r" | "b" | "l" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 420, height: 620, x: 0, y: 0, posX: 100, posY: 100 });
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Initialize position on client-side mount
  useEffect(() => {
    setPosition(getDefaultPosition());
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.width, position.x + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - size.height, position.y + deltaY)),
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragStart, position, size]);

  // Handle resizing
  useEffect(() => {
    if (!isResizing || !resizeEdge) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      switch (resizeEdge) {
        case "br":
          newWidth = resizeStart.width + deltaX;
          newHeight = resizeStart.height + deltaY;
          break;
        case "bl":
          newWidth = resizeStart.width - deltaX;
          newHeight = resizeStart.height + deltaY;
          newX = resizeStart.posX + deltaX;
          break;
        case "tr":
          newWidth = resizeStart.width + deltaX;
          newHeight = resizeStart.height - deltaY;
          newY = resizeStart.posY + deltaY;
          break;
        case "tl":
          newWidth = resizeStart.width - deltaX;
          newHeight = resizeStart.height - deltaY;
          newX = resizeStart.posX + deltaX;
          newY = resizeStart.posY + deltaY;
          break;
        case "t":
          newHeight = resizeStart.height - deltaY;
          newY = resizeStart.posY + deltaY;
          break;
        case "r":
          newWidth = resizeStart.width + deltaX;
          break;
        case "b":
          newHeight = resizeStart.height + deltaY;
          break;
        case "l":
          newWidth = resizeStart.width - deltaX;
          newX = resizeStart.posX + deltaX;
          break;
      }

      // Constrain dimensions
      newWidth = Math.max(320, Math.min(600, newWidth));
      newHeight = Math.max(400, Math.min(window.innerHeight - 100, newHeight));

      setSize({ width: newWidth, height: newHeight });
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeEdge(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
    
    const cursorMap: Record<string, string> = {
      br: "nwse-resize", tl: "nwse-resize", bl: "nesw-resize", tr: "nesw-resize",
      t: "ns-resize", r: "ew-resize", b: "ns-resize", l: "ew-resize",
    };
    document.body.style.cursor = cursorMap[resizeEdge || ""];

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, resizeStart, resizeEdge, position]);

  const handleResizeStart = (edge: "tl" | "tr" | "bl" | "br" | "t" | "r" | "b" | "l") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
    setResizeStart({
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    });
  };

  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  // Real system status data (would come from API in production)
  const operational = 7;
  const degraded = 1;
  const outages = 0;

  return (
    <div
      className="fixed z-[9999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <div className="relative h-full rounded-2xl border border-white/10 bg-[#020511]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 p-4 cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">System Status</div>
              <div className="text-xs text-white/60">Bear Universe • Real-time</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{operational}</div>
              <div className="mt-1 text-sm text-emerald-300">Operational</div>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{degraded}</div>
              <div className="mt-1 text-sm text-amber-300">Degraded</div>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-center">
              <div className="text-3xl font-bold text-rose-400">{outages}</div>
              <div className="mt-1 text-sm text-rose-300">Outages</div>
            </div>
          </div>

          {/* System Components */}
          <div className="space-y-3">
            {[
              { name: "Fleet Operations", status: "operational", latency: "45ms", desc: "All robots responding normally" },
              { name: "Data Pipeline", status: "operational", latency: "120ms", desc: "Real-time telemetry streaming" },
              { name: "AI Models", status: "operational", latency: "230ms", desc: "Ursa Minor & Ursa Major online" },
              { name: "Seoul Servi Factory", status: "operational", latency: "78ms", desc: "Production line nominal" },
              { name: "API Gateway", status: "degraded", latency: "450ms", desc: "Elevated response times" },
              { name: "Cloud Storage", status: "operational", latency: "95ms", desc: "All regions accessible" },
              { name: "Authentication", status: "operational", latency: "32ms", desc: "SSO and OAuth functional" },
            ].map((component, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      component.status === "operational" ? "bg-emerald-400 animate-pulse" :
                      component.status === "degraded" ? "bg-amber-400 animate-pulse" :
                      "bg-rose-400 animate-pulse"
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-white">{component.name}</div>
                      <div className="text-xs text-white/50 mt-0.5">{component.desc}</div>
                      <div className="text-xs text-white/40 mt-1">Latency: {component.latency}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    component.status === "operational" ? "bg-emerald-500/20 text-emerald-300" :
                    component.status === "degraded" ? "bg-amber-500/20 text-amber-300" :
                    "bg-rose-500/20 text-rose-300"
                  }`}>
                    {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Live Clock */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#020511]/80 backdrop-blur-sm p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Last updated: {formatTime(currentTime)}</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Resize Handles */}
        <>
          {/* Corners */}
          <div onMouseDown={handleResizeStart("tl")} className="absolute top-0 left-0 h-4 w-4 cursor-nwse-resize z-10" />
          <div onMouseDown={handleResizeStart("tr")} className="absolute top-0 right-0 h-4 w-4 cursor-nesw-resize z-10" />
          <div onMouseDown={handleResizeStart("bl")} className="absolute bottom-0 left-0 h-4 w-4 cursor-nesw-resize z-10" />
          <div onMouseDown={handleResizeStart("br")} className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize z-10" />
          {/* Edges */}
          <div onMouseDown={handleResizeStart("t")} className="absolute top-0 left-4 right-4 h-2 cursor-ns-resize" />
          <div onMouseDown={handleResizeStart("r")} className="absolute right-0 top-4 bottom-4 w-2 cursor-ew-resize" />
          <div onMouseDown={handleResizeStart("b")} className="absolute bottom-0 left-4 right-4 h-2 cursor-ns-resize" />
          <div onMouseDown={handleResizeStart("l")} className="absolute left-0 top-4 bottom-4 w-2 cursor-ew-resize" />
        </>
      </div>
    </div>
  );
}

