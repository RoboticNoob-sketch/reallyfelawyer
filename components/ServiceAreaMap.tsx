"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { MapSceneHandle } from "./ServiceAreaMapScene";

const MapScene = dynamic(() => import("./ServiceAreaMapScene"), { ssr: false });

export default function ServiceAreaMap() {
  const sceneRef = useRef<MapSceneHandle | null>(null);

  return (
    <div className="relative h-full w-full">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(212, 175, 55, 0.16), transparent 65%)",
        }}
      />
      <MapScene
        onReady={(handle) => {
          sceneRef.current = handle;
        }}
      />

      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => sceneRef.current?.zoomIn()}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-canvas/80 text-lg font-bold text-gold backdrop-blur transition-colors hover:border-gold hover:bg-canvas"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => sceneRef.current?.zoomOut()}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-canvas/80 text-lg font-bold text-gold backdrop-blur transition-colors hover:border-gold hover:bg-canvas"
        >
          −
        </button>
      </div>
    </div>
  );
}
