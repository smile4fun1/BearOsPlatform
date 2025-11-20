"use client";

import { useState } from "react";
import { PresentationSlides } from "@/components/presentation/PresentationSlides";

export default function InternalDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814]">
      <PresentationSlides />
    </div>
  );
}

