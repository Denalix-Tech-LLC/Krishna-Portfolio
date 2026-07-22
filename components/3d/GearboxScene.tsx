"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import Gear from "@/components/3d/Gear";

interface GearboxSceneProps {
  /** When true the assembly renders as a static exploded view. */
  reducedMotion: boolean;
}

/* ------------------------------------------------------------------ */
/* Assembly parameters                                                  */
/* ------------------------------------------------------------------ */

/** Base orientation of the exploded stack so it reads clearly in 3/4 view. */
const BASE_TILT_X = 0.48;
const BASE_TILT_Y = -0.35;
/** Nudged right/up so the hero copy owns the left half of the viewport. */
const ASSEMBLY_POSITION: [number, number, number] = [1.7, 0.1, 0];

/** Axial half-distance of the exploded housing end-plates. */
const PLATE_OFFSET = 1.9;
const PLATE_RADIUS = 3.3;
const PLATE_THICKNESS = 0.14;
const ROD_ORBIT = 3.12;
const RING_RADIUS = 2.75;
const RING_TUBE = 0.2;
const RING_Y = -0.9;
const SHAFT_LENGTH = 6.4;

const SUN = {
  teeth: 12,
  radius: 0.95,
  thickness: 0.44,
  toothHeight: 0.24,
  toothWidth: 0.3,
};
const PLANET = {
  teeth: 9,
  radius: 0.55,
  thickness: 0.4,
  toothHeight: 0.18,
  toothWidth: 0.24,
};
/** Planet centers sit where sun and planet teeth would mesh. */
const PLANET_ORBIT =
  SUN.radius + PLANET.radius + SUN.toothHeight + PLANET.toothHeight;

/** Gear-ratio-ish relative speeds (planets counter-rotate). */
const SUN_SPEED = 0.85;
const PLANET_SPEED = -SUN_SPEED * (SUN.teeth / PLANET.teeth);
const ASSEMBLY_SPEED = 0.15;

/* ------------------------------------------------------------------ */
/* Scene content                                                       */
/* ------------------------------------------------------------------ */

function Assembly({ reducedMotion }: GearboxSceneProps) {
  const parallaxRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Group>(null);
  const planetRefs = useRef<Array<THREE.Group | null>>([]);
  const frontPlateRef = useRef<THREE.Group>(null);
  const backPlateRef = useRef<THREE.Group>(null);
  const rodsRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const planetAngles = useMemo(
    () => [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3],
    []
  );
  const rodAngles = useMemo(
    () => Array.from({ length: 4 }, (_, i) => Math.PI / 4 + (i * Math.PI) / 2),
    []
  );

  /* Mouse parallax: track the pointer across the whole window (the hero
     overlay is pointer-events-none, so listening on window keeps it simple). */
  useEffect(() => {
    if (reducedMotion) return;
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    /* Slow rotation of the whole assembly about its axis. */
    if (spinRef.current) spinRef.current.rotation.y += delta * ASSEMBLY_SPEED;

    /* Sun and planets counter-rotate at gear-ratio-ish speeds. */
    if (sunRef.current) sunRef.current.rotation.y += delta * SUN_SPEED;
    for (const planet of planetRefs.current) {
      if (planet) planet.rotation.y += delta * PLANET_SPEED;
    }

    /* Breathing: the explosion offset gently oscillates. */
    const breathe = Math.sin(t * 0.7) * 0.16;
    const offset = PLATE_OFFSET + breathe;
    if (frontPlateRef.current) frontPlateRef.current.position.y = offset;
    if (backPlateRef.current) backPlateRef.current.position.y = -offset;
    if (rodsRef.current) rodsRef.current.scale.y = offset / PLATE_OFFSET;
    if (ringRef.current) ringRef.current.position.y = RING_Y - breathe * 0.5;

    /* Subtle parallax: lerp a few degrees toward the pointer offset. */
    if (parallaxRef.current) {
      parallaxRef.current.rotation.x = THREE.MathUtils.lerp(
        parallaxRef.current.rotation.x,
        BASE_TILT_X + pointer.current.y * 0.12,
        0.06
      );
      parallaxRef.current.rotation.y = THREE.MathUtils.lerp(
        parallaxRef.current.rotation.y,
        BASE_TILT_Y + pointer.current.x * 0.16,
        0.06
      );
    }
  });

  return (
    <group
      ref={parallaxRef}
      position={ASSEMBLY_POSITION}
      rotation={[BASE_TILT_X, BASE_TILT_Y, 0]}
    >
      <group ref={spinRef}>
        {/* Central shaft through the assembly axis */}
        <mesh>
          <cylinderGeometry args={[0.11, 0.11, SHAFT_LENGTH, 24]} />
          <meshStandardMaterial
            color="#aeb6c2"
            metalness={0.92}
            roughness={0.26}
          />
        </mesh>
        {/* Small shaft end-collars */}
        {[SHAFT_LENGTH / 2, -SHAFT_LENGTH / 2].map((y, index) => (
          <mesh key={index} position={[0, y, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.14, 24]} />
            <meshStandardMaterial
              color="#8b93a1"
              metalness={0.9}
              roughness={0.32}
            />
          </mesh>
        ))}

        {/* Sun gear — ember orange */}
        <group ref={sunRef}>
          <Gear
            teeth={SUN.teeth}
            radius={SUN.radius}
            thickness={SUN.thickness}
            toothHeight={SUN.toothHeight}
            toothWidth={SUN.toothWidth}
            color="#e07a3f"
            metalness={0.85}
            roughness={0.32}
          />
        </group>

        {/* Planet gears — steel blue, 120 degrees apart */}
        {planetAngles.map((angle, index) => (
          <group
            key={index}
            position={[
              Math.cos(angle) * PLANET_ORBIT,
              0,
              Math.sin(angle) * PLANET_ORBIT,
            ]}
          >
            <group
              ref={(el) => {
                planetRefs.current[index] = el;
              }}
            >
              <Gear
                teeth={PLANET.teeth}
                radius={PLANET.radius}
                thickness={PLANET.thickness}
                toothHeight={PLANET.toothHeight}
                toothWidth={PLANET.toothWidth}
                color="#77a3c9"
                metalness={0.88}
                roughness={0.3}
              />
            </group>
          </group>
        ))}

        {/* Outer ring gear, exploded below the gear plane */}
        <group ref={ringRef} position={[0, RING_Y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[RING_RADIUS, RING_TUBE, 20, 72]} />
            <meshStandardMaterial
              color="#345876"
              metalness={0.9}
              roughness={0.32}
            />
          </mesh>
        </group>

        {/* Semi-transparent housing end-plates, exploded along the axis */}
        {[
          { ref: frontPlateRef, y: PLATE_OFFSET },
          { ref: backPlateRef, y: -PLATE_OFFSET },
        ].map((plate, index) => (
          <group key={index} ref={plate.ref} position={[0, plate.y, 0]}>
            <mesh>
              <cylinderGeometry
                args={[PLATE_RADIUS, PLATE_RADIUS, PLATE_THICKNESS, 48]}
              />
              <meshStandardMaterial
                color="#9dc1de"
                metalness={0.6}
                roughness={0.25}
                transparent
                opacity={0.2}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}

        {/* Tie rods spanning between the plate positions */}
        <group ref={rodsRef}>
          {rodAngles.map((angle, index) => (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * ROD_ORBIT,
                0,
                Math.sin(angle) * ROD_ORBIT,
              ]}
            >
              <cylinderGeometry args={[0.05, 0.05, PLATE_OFFSET * 2, 12]} />
              <meshStandardMaterial
                color="#8b93a1"
                metalness={0.9}
                roughness={0.35}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas                                                               */
/* ------------------------------------------------------------------ */

export default function GearboxScene({ reducedMotion }: GearboxSceneProps) {
  return (
    <Canvas
      camera={{ position: [6, 3, 9], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reducedMotion ? "demand" : "always"}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Lights only — no environment maps or textures (network-free). */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} />
      <pointLight color="#5b8db8" position={[-6, 3, -5]} intensity={60} />
      <pointLight color="#e07a3f" position={[5.5, -2.5, 5]} intensity={45} />

      <Float
        speed={reducedMotion ? 0 : 1}
        rotationIntensity={0.15}
        floatIntensity={0.5}
      >
        <Assembly reducedMotion={reducedMotion} />
      </Float>

      <ContactShadows
        position={[ASSEMBLY_POSITION[0], -3.4, 0]}
        opacity={0.4}
        scale={13}
        blur={2.6}
        far={5.2}
        resolution={256}
        frames={reducedMotion ? 1 : Infinity}
      />
    </Canvas>
  );
}
