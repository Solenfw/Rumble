import { Ref } from 'react';
import * as THREE from 'three';

// Configuration for Planets (used in textures.ts)
export interface PlanetConfig {
  name: string;
  size: number;
  orbitRadius: number;
  duration: number;
  color: string;
  texturePath: string;
  ringsTexturePath?: string | null;
  // Computed properties for the Preview page
  sizePx?: number;
  orbitRadiusPx?: number; 
}

// The controls object from Leva (used in Earth.tsx)
export interface GlobeControls {
  RotationSpeed: number;
  CloudSpeed: number;
  StarsSpeed: number;
  sunDirection: [number, number, number]; // Array because Leva returns arrays
}

// Props for Earth.tsx
export interface EarthProps {
  controls: GlobeControls;
  earthquakes: import('./geojson').EarthquakeFeature[];
}

// Props for Clouds.tsx
export interface CloudsProps {
  earthCloudsTexture: string;
  earthCloudsTransparent: string;
  ref?: Ref<THREE.Mesh>;
}

// Props for NightLights.tsx
export interface NightLightsProps {
  sunDirection: number[]; // passed as array, converted to Vector3 inside
  dayMapTexture: string;
  nightMapTexture: string;
}

// Props for EarthMesh.tsx
export interface EarthMeshProps {
  dayMapTexture: string;
  earthSpecTexture: string;
  earthBumpTexture: string;
};