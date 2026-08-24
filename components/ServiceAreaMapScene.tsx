"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import Link from "next/link";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { geoAlbersUsa, type GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";

interface StateProperties {
  name: string;
  density?: number;
}

type StateFeature = Feature<Geometry, StateProperties>;

interface StatePoint {
  name: string;
  lat: number;
  lng: number;
}

// Rough geographic centers — close enough for a small ambient map label,
// not a precision pin.
const STATE_POINTS: StatePoint[] = [
  { name: "Texas", lat: 31.0, lng: -99.3 },
  { name: "Oklahoma", lat: 35.5, lng: -97.5 },
  { name: "New Mexico", lat: 34.5, lng: -106.1 },
  { name: "Arizona", lat: 34.2, lng: -111.6 },
];
const SERVICE_STATE_NAMES = new Set(STATE_POINTS.map((p) => p.name));

interface CityPoint {
  name: string;
  lat: number;
  lng: number;
  url: string;
}

const CITY_POINTS: CityPoint[] = [
  { name: "Dallas", lat: 32.7767, lng: -96.797, url: "/areas-we-serve/texas/dallas" },
  { name: "Houston", lat: 29.7604, lng: -95.3698, url: "/areas-we-serve/texas/houston" },
  { name: "Austin", lat: 30.2672, lng: -97.7431, url: "/areas-we-serve/texas/austin" },
  { name: "San Antonio", lat: 29.4241, lng: -98.4936, url: "/areas-we-serve/texas/san-antonio" },
  { name: "Fort Worth", lat: 32.7555, lng: -97.3308, url: "/areas-we-serve/texas/fort-worth" },
  { name: "Oklahoma City", lat: 35.4676, lng: -97.5164, url: "/areas-we-serve/oklahoma/oklahoma-city" },
  { name: "Tulsa", lat: 36.154, lng: -95.9928, url: "/areas-we-serve/oklahoma/tulsa" },
  { name: "Albuquerque", lat: 35.0844, lng: -106.6504, url: "/areas-we-serve/new-mexico/albuquerque" },
  { name: "Las Cruces", lat: 32.3199, lng: -106.7637, url: "/areas-we-serve/new-mexico/las-cruces" },
  { name: "Phoenix", lat: 33.4484, lng: -112.074, url: "/areas-we-serve/arizona/phoenix" },
  { name: "Tucson", lat: 32.2226, lng: -110.9747, url: "/areas-we-serve/arizona/tucson" },
];

// AlbersUSA has no correct inset for Puerto Rico (only the lower 48, AK and
// HI), so it renders as a stray sliver — drop it before projecting.
const EXCLUDED_STATES = new Set(["Puerto Rico"]);

// Coordinate space the projection is fit into before being rescaled down
// into 3D world units.
const BASE_WIDTH = 960;
const BASE_HEIGHT = 600;
const UNIT = 0.012;

const REGULAR_HEIGHT = 0.018;
const SERVICE_HEIGHT = 0.07;

const MIN_DIST = 2.4;
const MAX_DIST = 8.5;
// Default view: show the whole US map, not zoomed in on the service area.
const DEFAULT_DIST = MAX_DIST;
// Camera sits due south of the target (negative Z, our world convention has
// north as +Z) so the country reads right-side-up — north at the top of the
// frame — instead of tilted at a diagonal.
const INITIAL_DIR = new THREE.Vector3(0, 1.3, -1).normalize();

export interface MapSceneHandle {
  zoomIn: () => void;
  zoomOut: () => void;
}

interface StateShapeGroup {
  name: string;
  isService: boolean;
  shapes: THREE.Shape[];
}

type ProjectFn = (lng: number, lat: number) => [number, number] | null;

function ringToPoints(ring: Position[], project: ProjectFn): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  for (const [lng, lat] of ring) {
    const p = project(lng, lat);
    // The shape's local Y axis gets flipped to world Z by the geometry's
    // rotateX(-90deg) in StateMesh, so pre-negate here to land on the same
    // world Z that Markers/labels compute directly from project().
    if (p) pts.push(new THREE.Vector2(p[0], -p[1]));
  }
  return pts;
}

function polygonToShape(rings: Position[][], project: ProjectFn): THREE.Shape | null {
  if (!rings.length) return null;
  const outer = ringToPoints(rings[0], project);
  if (outer.length < 3) return null;
  const shape = new THREE.Shape(outer);
  for (let i = 1; i < rings.length; i++) {
    const holePts = ringToPoints(rings[i], project);
    if (holePts.length >= 3) shape.holes.push(new THREE.Path(holePts));
  }
  return shape;
}

function buildStateShapes(states: StateFeature[], project: ProjectFn): StateShapeGroup[] {
  return states
    .map((f) => {
      const isService = SERVICE_STATE_NAMES.has(f.properties.name);
      const polygons: Position[][][] =
        f.geometry.type === "Polygon"
          ? [f.geometry.coordinates as Position[][]]
          : f.geometry.type === "MultiPolygon"
            ? (f.geometry.coordinates as Position[][][])
            : [];
      const shapes = polygons
        .map((rings) => polygonToShape(rings, project))
        .filter((s): s is THREE.Shape => s !== null);
      return { name: f.properties.name, isService, shapes };
    })
    .filter((g) => g.shapes.length > 0);
}

function StateMesh({ group }: { group: StateShapeGroup }) {
  const { geometry, edges } = useMemo(() => {
    const depth = group.isService ? SERVICE_HEIGHT : REGULAR_HEIGHT;
    const geo = new THREE.ExtrudeGeometry(group.shapes, { depth, bevelEnabled: false, curveSegments: 8 });
    // ExtrudeGeometry extrudes along local +Z; rotate so the extrusion
    // becomes "up" (+Y) and the shape's original XY plane becomes the
    // ground-facing XZ footprint.
    geo.rotateX(-Math.PI / 2);
    geo.computeVertexNormals();
    return { geometry: geo, edges: new THREE.EdgesGeometry(geo, 25) };
  }, [group]);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={group.isService ? "#D4AF37" : "#38322a"}
          metalness={group.isService ? 0.6 : 0.1}
          roughness={group.isService ? 0.32 : 0.9}
          emissive={group.isService ? "#5c4310" : "#000000"}
          emissiveIntensity={group.isService ? 0.35 : 0}
          transparent={!group.isService}
          opacity={group.isService ? 1 : 0.6}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={group.isService ? "#F3DA8C" : "#6b6b6b"}
          transparent
          opacity={group.isService ? 0.9 : 0.3}
        />
      </lineSegments>
    </group>
  );
}

function Markers({ project, heightByName }: { project: ProjectFn; heightByName: Map<string, number> }) {
  return (
    <>
      {STATE_POINTS.map((point) => {
        const p = project(point.lng, point.lat);
        if (!p) return null;
        const y = (heightByName.get(point.name) ?? SERVICE_HEIGHT) + 0.13;
        return (
          <group key={point.name} position={[p[0], y, p[1]]}>
            <Html center transform sprite occlude={false} scale={0.35} style={{ pointerEvents: "none" }}>
              <div className="flex flex-col items-center gap-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
                </span>
                <span className="whitespace-nowrap rounded-full border border-gold/30 bg-canvas/85 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                  {point.name}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

function CityMarkers({ project }: { project: ProjectFn }) {
  return (
    <>
      {CITY_POINTS.map((city) => {
        const p = project(city.lng, city.lat);
        if (!p) return null;
        const y = SERVICE_HEIGHT + 0.008;
        return (
          <group key={city.name} position={[p[0], y, p[1]]}>
            <Html center transform sprite occlude={false} scale={0.2}>
              <Link href={city.url} className="group flex flex-col items-center gap-0.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-[#F3DA8C] shadow-[0_0_5px_rgba(243,218,140,0.9)] transition-transform duration-150 group-hover:scale-150" />
                <span className="whitespace-nowrap rounded-full bg-canvas/75 px-1.5 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur transition-colors duration-150 group-hover:bg-canvas group-hover:text-gold">
                  {city.name}
                </span>
              </Link>
            </Html>
          </group>
        );
      })}
    </>
  );
}

function CameraRig({ target, onReady }: { target: THREE.Vector3; onReady?: (handle: MapSceneHandle) => void }) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const targetDistance = useRef(DEFAULT_DIST);
  const { camera } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.copy(target);
    controls.update();
  }, [target]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const offset = camera.position.clone().sub(controls.target);
    const dist = offset.length() || 1;
    const next = THREE.MathUtils.lerp(dist, targetDistance.current, 0.08);
    if (Math.abs(next - dist) > 0.0005) {
      offset.setLength(next);
      camera.position.copy(controls.target).add(offset);
    }
    controls.update();
  });

  const zoomIn = useCallback(() => {
    targetDistance.current = THREE.MathUtils.clamp(targetDistance.current * 0.72, MIN_DIST, MAX_DIST);
  }, []);
  const zoomOut = useCallback(() => {
    targetDistance.current = THREE.MathUtils.clamp(targetDistance.current * 1.35, MIN_DIST, MAX_DIST);
  }, []);

  useEffect(() => {
    onReady?.({ zoomIn, zoomOut });
  }, [onReady, zoomIn, zoomOut]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.3}
      minAzimuthAngle={(2 * Math.PI) / 3}
      maxAzimuthAngle={(4 * Math.PI) / 3}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

function Scene({ states, onReady }: { states: StateFeature[]; onReady?: (handle: MapSceneHandle) => void }) {
  const projection = useMemo<GeoProjection>(() => {
    const proj = geoAlbersUsa();
    proj.fitSize([BASE_WIDTH, BASE_HEIGHT], { type: "FeatureCollection", features: states } as FeatureCollection);
    return proj;
  }, [states]);

  const project = useCallback<ProjectFn>(
    (lng, lat) => {
      const p = projection([lng, lat]);
      if (!p) return null;
      return [(p[0] - BASE_WIDTH / 2) * UNIT, -(p[1] - BASE_HEIGHT / 2) * UNIT];
    },
    [projection]
  );

  const stateShapes = useMemo(() => buildStateShapes(states, project), [states, project]);

  const heightByName = useMemo(() => {
    const map = new Map<string, number>();
    stateShapes.forEach((g) => map.set(g.name, g.isService ? SERVICE_HEIGHT : REGULAR_HEIGHT));
    return map;
  }, [stateShapes]);

  const serviceCentroid = useMemo(() => {
    const pts = STATE_POINTS.map((p) => project(p.lng, p.lat)).filter((p): p is [number, number] => p !== null);
    if (!pts.length) return new THREE.Vector3(0, 0, 0);
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cz = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    return new THREE.Vector3(cx, 0, cz);
  }, [project]);

  const initialCameraPosition = useMemo(
    () => serviceCentroid.clone().add(INITIAL_DIR.clone().multiplyScalar(DEFAULT_DIST)),
    [serviceCentroid]
  );

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 32, position: initialCameraPosition.toArray() }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#4a3a18", "#0a0a0a", 0.45]} />
      <directionalLight
        position={[3.5, 6, 2.5]}
        intensity={1.15}
        color="#FFEFC4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <fog attach="fog" args={["#0a0a0a", 6, 13]} />
      {stateShapes.map((group) => (
        <StateMesh key={group.name} group={group} />
      ))}
      <CityMarkers project={project} />
      <Markers project={project} heightByName={heightByName} />
      <CameraRig target={serviceCentroid} onReady={onReady} />
    </Canvas>
  );
}

export interface MapSceneProps {
  onReady?: (handle: MapSceneHandle) => void;
}

export default function ServiceAreaMapScene({ onReady }: MapSceneProps) {
  const [states, setStates] = useState<StateFeature[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/map/us-states.geojson")
      .then((res) => res.json())
      .then((data: FeatureCollection<Geometry, StateProperties>) => {
        if (!cancelled) {
          setStates(data.features.filter((f) => !EXCLUDED_STATES.has(f.properties.name)));
        }
      })
      .catch(() => {
        // State outlines are the whole point of this map, but fail silently
        // rather than crash the page if the fetch fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!states.length) return null;

  return <Scene states={states} onReady={onReady} />;
}
