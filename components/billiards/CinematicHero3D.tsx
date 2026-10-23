'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createBallTexture, createFeltTexture } from '@/lib/billiards/textures';

const BALL_RADIUS = 0.17;
const BALL_DIAMETER = BALL_RADIUS * 2;
const RACK_APEX_X = 1.45;
const CUE_START_X = -2.55;

// Table Felt Physical Bounds
const TABLE_MIN_X = -4.8;
const TABLE_MAX_X = 4.8;
const TABLE_MIN_Z = -2.5;
const TABLE_MAX_Z = 2.5;

interface BallPhysicsState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  quaternion: THREE.Quaternion;
  angularVel: THREE.Vector3;
  number: number;
  launchOut: boolean; // Flag if this ball is chosen to fly towards camera (4th wall break)
}

// 8-Ball Rack layout
const RACK_NUMBERS = [
  1,               // Apex (Solid 1)
  2, 10,           // Row 2
  3, 8, 11,        // Row 3 (8-ball in center)
  12, 4, 13, 5,    // Row 4
  6, 14, 7, 15, 9, // Row 5
];

interface SceneProps {
  playProgress: number; // 0 to 1
  isLowEnd?: boolean;
  onImpact?: () => void;
  onSettled?: () => void;
}

function Billiards3DScene({ playProgress, isLowEnd = false, onImpact, onSettled }: SceneProps) {
  const { camera } = useThree();

  const cueStickRef = useRef<THREE.Group>(null);
  const ballMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ballMaterialsRef = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);

  // Simulation flags
  const simTimeRef = useRef(0);
  const isStruckRef = useRef(false);
  const hasSettledRef = useRef(false);

  // Memoized textures
  const ballTextures = useMemo(() => {
    const map: Record<number, THREE.CanvasTexture> = {};
    for (let i = 0; i <= 15; i++) {
      map[i] = createBallTexture(i);
    }
    return map;
  }, []);

  const feltTexture = useMemo(() => createFeltTexture(), []);

  // Geometry
  const sphereSegments = isLowEnd ? 20 : 36;
  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(BALL_RADIUS, sphereSegments, sphereSegments),
    [sphereSegments]
  );

  // Initial States matching reference photograph
  const initialBallStates = useMemo(() => {
    const states: BallPhysicsState[] = [];

    // 0: Cue Ball
    states.push({
      x: CUE_START_X,
      y: BALL_RADIUS,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      quaternion: new THREE.Quaternion(),
      angularVel: new THREE.Vector3(),
      number: 0,
      launchOut: false,
    });

    // 1-15: Racked Triangle
    const dx = BALL_DIAMETER * Math.cos(Math.PI / 6) * 1.004;
    let ballIdx = 0;

    for (let row = 0; row < 5; row++) {
      const rowX = RACK_APEX_X + row * dx;
      const startZ = -((row * BALL_DIAMETER * 1.004) / 2);

      for (let col = 0; col <= row; col++) {
        const rowZ = startZ + col * BALL_DIAMETER * 1.004;
        const num = RACK_NUMBERS[ballIdx++];
        // Selected balls (like row 2 corners, apex, row 4 edge) are marked for 4th wall pop
        const willLaunch = num === 1 || num === 2 || num === 5 || num === 11 || num === 9;

        states.push({
          x: rowX,
          y: BALL_RADIUS,
          z: rowZ,
          vx: 0,
          vy: 0,
          vz: 0,
          quaternion: new THREE.Quaternion(),
          angularVel: new THREE.Vector3(),
          number: num,
          launchOut: willLaunch,
        });
      }
    }

    return states;
  }, []);

  // Mutable live physics states
  const currentStates = useRef<BallPhysicsState[]>(
    initialBallStates.map((s) => ({
      ...s,
      quaternion: s.quaternion.clone(),
      angularVel: s.angularVel.clone(),
    }))
  );

  // Reset function
  const resetSimulation = () => {
    initialBallStates.forEach((init, idx) => {
      const cur = currentStates.current[idx];
      cur.x = init.x;
      cur.y = init.y;
      cur.z = init.z;
      cur.vx = 0;
      cur.vy = 0;
      cur.vz = 0;
      cur.quaternion.set(0, 0, 0, 1);
      cur.angularVel.set(0, 0, 0);
    });
    simTimeRef.current = 0;
    isStruckRef.current = false;
    hasSettledRef.current = false;
  };

  // Trigger when playProgress changes from 1 back to 0
  const lastProgressRef = useRef(playProgress);
  useEffect(() => {
    if (playProgress === 0 && lastProgressRef.current > 0) {
      resetSimulation();
    }
    lastProgressRef.current = playProgress;
  }, [playProgress]);

  // Initial camera orientation
  useEffect(() => {
    camera.position.set(0, 6.2, 1.2);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Cleanup WebGL textures & geometries
  useEffect(() => {
    return () => {
      Object.values(ballTextures).forEach((t) => t.dispose());
      feltTexture.dispose();
      sphereGeometry.dispose();
      ballMaterialsRef.current.forEach((m) => m?.dispose());
    };
  }, [ballTextures, feltTexture, sphereGeometry]);

  // Frame Loop (Physics + Perspective enlargement + Fourth-wall break)
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);

    // Target animation time mapped from playProgress (total animation ~6.0s)
    const targetTime = playProgress * 6.0;

    // Advance simulation towards targetTime
    if (simTimeRef.current < targetTime) {
      const stepDt = Math.min(dt, targetTime - simTimeRef.current);
      simTimeRef.current += stepDt;
    }

    const t = simTimeRef.current;
    const cueStick = cueStickRef.current;
    const cueBall = currentStates.current[0];

    // Phase 1 & 2: Cue Stick Movement
    if (cueStick) {
      if (t < 0.6) {
        // Idle hover
        cueStick.visible = true;
        cueStick.position.set(cueBall.x - 1.55, BALL_RADIUS, cueBall.z);
      } else if (t >= 0.6 && t < 1.4) {
        // Smooth pullback
        const pullProgress = (t - 0.6) / 0.8;
        const ease = Math.sin((pullProgress * Math.PI) / 2);
        cueStick.position.set(cueBall.x - 1.55 - ease * 0.95, BALL_RADIUS, cueBall.z);
      } else if (t >= 1.4 && t < 1.7) {
        // High-speed strike forward
        const strikeProgress = (t - 1.4) / 0.3;
        cueStick.position.set(cueBall.x - 1.55 - (1 - strikeProgress) * 0.95, BALL_RADIUS, cueBall.z);
      } else {
        // Fade or pull stick away after shot
        cueStick.visible = false;
      }
    }

    // Phase 2 Strike: Apply Cue Ball velocity at t = 1.7s
    if (t >= 1.7 && !isStruckRef.current) {
      isStruckRef.current = true;
      cueBall.vx = 17.5; // High forward momentum toward rack
      cueBall.vz = (Math.random() - 0.5) * 0.04;
      onImpact?.();
    }

    // Phase 3 & 4: Sub-stepped Physics Simulation
    const subSteps = 14;
    const subDt = dt / subSteps;
    const gravity = -9.81;

    // Only run physics while simulation is active
    if (t >= 1.7 && t < 6.0) {
      for (let s = 0; s < subSteps; s++) {
        // 1. Advance ball positions & apply gravity
        for (let i = 0; i < currentStates.current.length; i++) {
          const b = currentStates.current[i];

          if (
            Math.abs(b.vx) > 0.001 ||
            Math.abs(b.vy) > 0.001 ||
            Math.abs(b.vz) > 0.001 ||
            b.y > BALL_RADIUS + 0.001
          ) {
            b.x += b.vx * subDt;
            b.y += b.vy * subDt;
            b.z += b.vz * subDt;

            // Airborne physics
            if (b.y > BALL_RADIUS) {
              b.vy += gravity * subDt;
            } else {
              b.y = BALL_RADIUS;
              if (b.vy < 0) {
                b.vy = -b.vy * 0.42; // Felt impact damping
                if (Math.abs(b.vy) < 0.15) b.vy = 0;
              }
            }

            // Felt rolling friction damping
            const friction = b.y > BALL_RADIUS + 0.02 ? 0.998 : 0.978;
            b.vx *= Math.pow(friction, subDt * 60);
            b.vz *= Math.pow(friction, subDt * 60);

            // 3D Spin rotation
            const rotX = b.vz / BALL_RADIUS + b.angularVel.x;
            const rotZ = -b.vx / BALL_RADIUS + b.angularVel.z;
            const rotY = b.angularVel.y;
            const rotVec = new THREE.Vector3(rotX, rotY, rotZ);
            const rotLen = rotVec.length();

            if (rotLen > 0.001) {
              const deltaRot = new THREE.Quaternion().setFromAxisAngle(
                rotVec.clone().normalize(),
                rotLen * subDt
              );
              b.quaternion.multiplyQuaternions(deltaRot, b.quaternion);
            }
          }
        }

        // 2. Cushion boundaries (keep non-launched balls on table)
        for (let i = 0; i < currentStates.current.length; i++) {
          const b = currentStates.current[i];
          if (!b.launchOut) {
            if (b.x < TABLE_MIN_X + BALL_RADIUS) {
              b.x = TABLE_MIN_X + BALL_RADIUS;
              b.vx = -b.vx * 0.82;
            }
            if (b.x > TABLE_MAX_X - BALL_RADIUS) {
              b.x = TABLE_MAX_X - BALL_RADIUS;
              b.vx = -b.vx * 0.82;
            }
            if (b.z < TABLE_MIN_Z + BALL_RADIUS) {
              b.z = TABLE_MIN_Z + BALL_RADIUS;
              b.vz = -b.vz * 0.82;
            }
            if (b.z > TABLE_MAX_Z - BALL_RADIUS) {
              b.z = TABLE_MAX_Z - BALL_RADIUS;
              b.vz = -b.vz * 0.82;
            }
          }
        }

        // 3. 3D Elastic Collisions & Fourth-Wall Launch Trigger
        for (let i = 0; i < currentStates.current.length; i++) {
          for (let j = i + 1; j < currentStates.current.length; j++) {
            const b1 = currentStates.current[i];
            const b2 = currentStates.current[j];

            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dz = b2.z - b1.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < BALL_DIAMETER * BALL_DIAMETER && distSq > 0.000001) {
              const dist = Math.sqrt(distSq);
              const overlap = BALL_DIAMETER - dist;
              const nx = dx / dist;
              const ny = dy / dist;
              const nz = dz / dist;

              // Separate overlapping balls
              b1.x -= nx * overlap * 0.5;
              b1.y -= ny * overlap * 0.5;
              b1.z -= nz * overlap * 0.5;
              b2.x += nx * overlap * 0.5;
              b2.y += ny * overlap * 0.5;
              b2.z += nz * overlap * 0.5;

              // Relative velocity
              const rvx = b2.vx - b1.vx;
              const rvy = b2.vy - b1.vy;
              const rvz = b2.vz - b1.vz;
              const velNormal = rvx * nx + rvy * ny + rvz * nz;

              if (velNormal < 0) {
                const restitution = 0.96;
                const impulse = -(1 + restitution) * velNormal * 0.5;

                b1.vx -= nx * impulse;
                b1.vy -= ny * impulse;
                b1.vz -= nz * impulse;

                b2.vx += nx * impulse;
                b2.vy += ny * impulse;
                b2.vz += nz * impulse;

                // Fourth Wall Launch Effect:
                // High energy collisions give selected balls vertical Y + forward Z impulse toward camera
                if (Math.abs(impulse) > 1.8) {
                  if (b1.launchOut || b2.launchOut) {
                    const popStrength = 3.6 + Math.random() * 2.2;
                    if (b1.launchOut) {
                      b1.vy += popStrength;
                      b1.vz += (Math.random() - 0.5) * 4.0 + 1.2; // Move toward camera
                      b1.angularVel.set(
                        (Math.random() - 0.5) * 12,
                        (Math.random() - 0.5) * 12,
                        (Math.random() - 0.5) * 12
                      );
                    }
                    if (b2.launchOut) {
                      b2.vy += popStrength;
                      b2.vz += (Math.random() - 0.5) * 4.0 + 1.2; // Move toward camera
                      b2.angularVel.set(
                        (Math.random() - 0.5) * 12,
                        (Math.random() - 0.5) * 12,
                        (Math.random() - 0.5) * 12
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Check if balls have settled in Phase 5
    if (t >= 5.0 && !hasSettledRef.current) {
      hasSettledRef.current = true;
      onSettled?.();
    }

    // Update 3D Mesh Transforms
    currentStates.current.forEach((state, i) => {
      const mesh = ballMeshRefs.current[i];
      if (mesh) {
        mesh.position.set(state.x, state.y, state.z);
        mesh.quaternion.copy(state.quaternion);

        // Perspective Depth: as balls fly up towards camera (y increases),
        // let their shadow distance increase naturally
      }
    });

    // Camera Cinematic Response & Impact Push-In
    let camShakeX = 0;
    let camShakeY = 0;
    let camShakeZ = 0;

    // Shake upon impact (1.9s to 2.5s)
    if (t >= 1.9 && t < 2.5) {
      const decay = 1.0 - (t - 1.9) / 0.6;
      camShakeX = (Math.random() - 0.5) * 0.08 * decay;
      camShakeY = (Math.random() - 0.5) * 0.05 * decay;
      camShakeZ = (Math.random() - 0.5) * 0.06 * decay;
    }

    // Subtle drift during phase 1, push-in during phase 4
    const pushIn = t > 1.8 && t < 4.0 ? Math.sin(((t - 1.8) / 2.2) * Math.PI) * 0.35 : 0;
    const idleDrift = Math.sin((t / 6.0) * Math.PI * 2) * 0.12;

    camera.position.set(idleDrift + camShakeX, 6.2 - pushIn + camShakeY, 1.2 + camShakeZ);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Cinematic Studio Lighting matching reference image */}
      <ambientLight intensity={0.4} color="#E2E8F0" />

      {/* Main Overhead Soft Key Spotlight */}
      <spotLight
        position={[0, 8.5, 0]}
        angle={0.65}
        penumbra={0.6}
        intensity={3.2}
        color="#FFFDF7"
        castShadow={!isLowEnd}
        shadow-mapSize-width={isLowEnd ? 256 : 512}
        shadow-mapSize-height={isLowEnd ? 256 : 512}
        shadow-bias={-0.0001}
      />

      {/* Soft Fill Light to illuminate balls flying out of screen */}
      <directionalLight position={[0, 4, 5]} intensity={0.6} color="#CBD5E1" />

      {/* High-Gloss Billiard Balls */}
      <group>
        {initialBallStates.map((ballState, i) => {
          const num = ballState.number;
          const tex = ballTextures[num];

          return (
            <mesh
              key={i}
              ref={(el) => {
                ballMeshRefs.current[i] = el;
              }}
              position={[ballState.x, ballState.y, ballState.z]}
              castShadow={!isLowEnd}
              receiveShadow={!isLowEnd}
              geometry={sphereGeometry}
            >
              <meshPhysicalMaterial
                ref={(el) => {
                  ballMaterialsRef.current[i] = el;
                }}
                map={tex}
                roughness={0.1}
                metalness={0.06}
                clearcoat={1.0}
                clearcoatRoughness={0.07}
                reflectivity={0.94}
              />
            </mesh>
          );
        })}
      </group>

      {/* 3D Cue Stick Mesh */}
      <group ref={cueStickRef} position={[CUE_START_X - 1.55, BALL_RADIUS, 0]}>
        {/* Maple Wood Shaft */}
        <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.034, 2.4, 16]} />
          <meshStandardMaterial color="#D4A373" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* White Ferrule */}
        <mesh position={[-0.015, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.04, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Blue Chalk Tip */}
        <mesh position={[0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.012, 16]} />
          <meshStandardMaterial color="#2563EB" roughness={0.8} />
        </mesh>
      </group>
    </>
  );
}

export interface CinematicHero3DProps {
  playProgress: number; // 0 to 1
  onImpact?: () => void;
  onSettled?: () => void;
  className?: string;
}

export function CinematicHero3D({
  playProgress,
  onImpact,
  onSettled,
  className = '',
}: CinematicHero3DProps) {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    // Detect mobile or low concurrency
    const isMobile = window.innerWidth < 768;
    const lowCores =
      typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency <= 4
        : false;

    if (isMobile || lowCores) {
      setIsLowEnd(true);
    }

    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isTabVisible && (
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: !isLowEnd,
            powerPreference: 'high-performance',
            alpha: true, // Transparent canvas so background clean plate shows through
          }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <Billiards3DScene
            playProgress={playProgress}
            isLowEnd={isLowEnd}
            onImpact={onImpact}
            onSettled={onSettled}
          />
        </Canvas>
      )}
    </div>
  );
}
