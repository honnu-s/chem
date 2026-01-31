"use client";

import * as React from "react";
import { InteractiveGridPattern } from "./ui/interactive-grid-pattern";

export function InteractiveGridBg() {
  return (
    <InteractiveGridPattern
      className="absolute inset-0"
      style={{
        backgroundColor: "white", 
      }}
      patternColor="rgba(16, 185, 129, 0.3)" 
    />
  );
}
