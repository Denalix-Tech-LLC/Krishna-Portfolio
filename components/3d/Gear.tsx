"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

export interface GearProps {
  /** Number of teeth arranged radially around the body. */
  teeth?: number;
  /** Radius of the cylindrical gear body (teeth protrude beyond this). */
  radius?: number;
  /** Axial thickness of the gear. */
  thickness?: number;
  /** How far each tooth protrudes radially from the body. */
  toothHeight?: number;
  /** Tangential width of each tooth. */
  toothWidth?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  /** Render a small dark center bore through the gear. */
  withBore?: boolean;
  /** Bore radius; defaults to 30% of the body radius. */
  boreRadius?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Reusable parametric gear built purely from primitives: a cylinder body with
 * box teeth arranged radially, plus an optional dark center bore. The gear
 * axis is the local Y axis (default cylinder orientation).
 */
export default function Gear({
  teeth = 10,
  radius = 1,
  thickness = 0.35,
  toothHeight = 0.22,
  toothWidth = 0.26,
  color = "#5b8db8",
  metalness = 0.85,
  roughness = 0.3,
  withBore = true,
  boreRadius,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: GearProps) {
  const toothCount = Math.max(3, Math.round(teeth));
  const bore = boreRadius ?? radius * 0.3;

  const toothAngles = useMemo(
    () =>
      Array.from(
        { length: toothCount },
        (_, i) => (i / toothCount) * Math.PI * 2
      ),
    [toothCount]
  );

  /* Shared material + tooth geometry keep the object count low. */
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness, roughness }),
    [color, metalness, roughness]
  );
  const boreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0c1017",
        metalness: 0.5,
        roughness: 0.6,
      }),
    []
  );
  const toothGeometry = useMemo(
    () => new THREE.BoxGeometry(toothHeight, thickness, toothWidth),
    [toothHeight, thickness, toothWidth]
  );

  useEffect(() => {
    return () => {
      material.dispose();
      boreMaterial.dispose();
      toothGeometry.dispose();
    };
  }, [material, boreMaterial, toothGeometry]);

  return (
    <group position={position} rotation={rotation}>
      {/* Gear body */}
      <mesh material={material}>
        <cylinderGeometry args={[radius, radius, thickness, 48]} />
      </mesh>

      {/* Teeth, arranged radially around the body */}
      {toothAngles.map((angle, index) => (
        <mesh
          key={index}
          geometry={toothGeometry}
          material={material}
          position={[
            Math.cos(angle) * (radius + toothHeight / 2),
            0,
            Math.sin(angle) * (radius + toothHeight / 2),
          ]}
          rotation={[0, -angle, 0]}
        />
      ))}

      {/* Center bore */}
      {withBore ? (
        <mesh material={boreMaterial}>
          <cylinderGeometry args={[bore, bore, thickness * 1.12, 32]} />
        </mesh>
      ) : null}
    </group>
  );
}
