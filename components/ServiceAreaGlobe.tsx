"use client";

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface StatePoint {
  name: string;
  lat: number;
  lng: number;
}

interface CountryFeature {
  type: "Feature";
  properties: { ADMIN: string };
  geometry: { type: string; coordinates: unknown };
}

// Rough geographic centers — close enough for a small ambient globe, not a
// precision map.
const STATE_POINTS: StatePoint[] = [
  { name: "Texas", lat: 31.0, lng: -99.3 },
  { name: "Oklahoma", lat: 35.5, lng: -97.5 },
  { name: "New Mexico", lat: 34.5, lng: -106.1 },
  { name: "Arizona", lat: 34.2, lng: -111.6 },
];

function isUSA(feat: object) {
  return (feat as CountryFeature).properties.ADMIN === "United States of America";
}

// three-globe's globe radius is 100 three.js units; camera distance works out
// to roughly (altitude + 1) * radius, so these bound the zoom to a close-in
// view without clipping into the surface and a far-out view that still reads
// as a globe rather than a speck.
const MIN_ALTITUDE = 0.3;
const MAX_ALTITUDE = 4;
// Default view: 75% of the way from fully zoomed out (MAX_ALTITUDE) to fully
// zoomed in (MIN_ALTITUDE).
const DEFAULT_ZOOM_PERCENT = 0.75;
const DEFAULT_ALTITUDE = MAX_ALTITUDE - DEFAULT_ZOOM_PERCENT * (MAX_ALTITUDE - MIN_ALTITUDE);

export default function ServiceAreaGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [countries, setCountries] = useState<CountryFeature[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/globe/countries.geojson")
      .then((res) => res.json())
      .then((data: { features: CountryFeature[] }) => {
        if (!cancelled) setCountries(data.features);
      })
      .catch(() => {
        // Country outlines are a visual enhancement, not core content —
        // fail silently and keep the plain textured globe if the fetch fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // A callback ref (rather than a useRef + useEffect keyed on some other
  // state) so this runs exactly when the globe instance becomes available —
  // Globe is dynamically imported (ssr:false), so its ref can attach well
  // after mount, and an effect tied to unrelated state can fire too early
  // and silently never set autoRotate.
  const setGlobeRef = useCallback((instance: GlobeMethods | undefined) => {
    globeRef.current = instance;
    if (!instance) return;
    instance.pointOfView({ lat: 34, lng: -100, altitude: DEFAULT_ALTITUDE }, 0);
    const controls = instance.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.6;
    controls.minDistance = (MIN_ALTITUDE + 1) * 100;
    controls.maxDistance = (MAX_ALTITUDE + 1) * 100;
  }, []);

  const zoomBy = useCallback((factor: number) => {
    const globe = globeRef.current;
    if (!globe) return;
    const { lat, lng, altitude } = globe.pointOfView();
    const nextAltitude = Math.min(MAX_ALTITUDE, Math.max(MIN_ALTITUDE, altitude * factor));
    globe.pointOfView({ lat, lng, altitude: nextAltitude }, 400);
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {size.width > 0 && (
        <Globe
          // react-globe.gl's types only declare a MutableRefObject, but React
          // ref props always accept a callback ref at runtime too.
          ref={setGlobeRef as unknown as MutableRefObject<GlobeMethods | undefined>}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/globe/earth-dark.jpg"
          showAtmosphere
          atmosphereColor="#D4AF37"
          atmosphereAltitude={0.25}
          polygonsData={countries}
          polygonCapColor={(feat) => (isUSA(feat) ? "rgba(212, 175, 55, 0.35)" : "rgba(255, 255, 255, 0.05)")}
          polygonSideColor={() => "rgba(212, 175, 55, 0.15)"}
          polygonStrokeColor={(feat) => (isUSA(feat) ? "#F3DA8C" : "rgba(255, 255, 255, 0.25)")}
          polygonAltitude={(feat) => (isUSA(feat) ? 0.012 : 0.004)}
          polygonLabel={(feat) => (feat as CountryFeature).properties.ADMIN}
          pointsData={STATE_POINTS}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#D4AF37"}
          pointAltitude={0.02}
          pointRadius={0.45}
          pointLabel="name"
          ringsData={STATE_POINTS}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) => `rgba(212, 175, 55, ${1 - t})`}
          ringMaxRadius={4}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1400}
          ringAltitude={0.02}
          labelsData={STATE_POINTS}
          labelLat="lat"
          labelLng="lng"
          labelText="name"
          labelSize={1.1}
          labelColor={() => "#FFFFFF"}
          labelDotRadius={0}
          labelAltitude={0.03}
        />
      )}

      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => zoomBy(0.7)}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-canvas/80 text-lg font-bold text-gold backdrop-blur transition-colors hover:border-gold hover:bg-canvas"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1.4)}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-canvas/80 text-lg font-bold text-gold backdrop-blur transition-colors hover:border-gold hover:bg-canvas"
        >
          −
        </button>
      </div>
    </div>
  );
}
