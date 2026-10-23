'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createBallTexture, createFeltTexture } from '@/lib/billiards/textures';

const BALL_RADIUS = 0.16;
const BALL_DIAMETER = BALL_RADIUS * 2;
const RACK_APEX_X = 1.3;
const CUE_START_X = -2.5;
const LOOP_DURATION = 12.0;

// Table Bounds
const TABLE_MIN_X = -4.5;
const TABLE_MAX_X = 4.5;
const TABLE_MIN_Z = -2.4;
const TABLE_MAX_Z = 2.4;

interface BallState3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  quaternion: THREE.Quaternion;
  angularVel: THREE.Vector3;
  number: number;
}

// 8-Ball Rack layout matching standard reference photo
const RACK_NUMBERS = [
  1,               // Apex (Solid 1)
  2, 10,           // Row 2
  3, 8, 11,        // Row 3 (8-ball in center!)
  12, 4, 13, 5,    // Row 4
  6, 14, 7, 15, 9, // Row 5
];

export function BilliardsScene({
  isLowEnd = false,
  isReducedMotion = false,
  onFpsReport,
}: {
  isLowEnd?: boolean;
  isReducedMotion?: boolean;
  onFpsReport?: (fps: number) => void;
}) {
  const { camera } = useThree();

  const ballGroupRef = useRef<THREE.Group>(null);
  const cueStickRef = useRef<THREE.Group>(null);

  const ballMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ballMaterialsRef = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);

  // Timeline tracking
  const loopTimeRef = useRef(0);
  const isStruckRef = useRef(false);
  const strikeRandomAngleRef = useRef(0);
  const strikeRandomPowerRef = useRef(1.0);

  // Performance FPS monitoring
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());

  // Textures memoized
  const ballTextures = useMemo(() => {
    const map: Record<number, THREE.CanvasTexture> = {};
    for (let i = 0; i <= 15; i++) {
      map[i] = createBallTexture(i);
    }
    return map;
  }, []);

  const feltTexture = useMemo(() => createFeltTexture(), []);

  // Ball Sphere Geometry
  const sphereSegments = isLowEnd ? 16 : 32;
  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(BALL_RADIUS, sphereSegments, sphereSegments),
    [sphereSegments]
  );

  // Initial 3D Ball Positions (matching top-down reference layout)
  const initialBallStates = useMemo(() => {
    const states: BallState3D[] = [];

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
    });

    // 1-15: Racked Triangle
    const dx = BALL_DIAMETER * Math.cos(Math.PI / 6) * 1.006;
    let ballIdx = 0;

    for (let row = 0; row < 5; row++) {
      const rowX = RACK_APEX_X + row * dx;
      const startZ = -((row * BALL_DIAMETER * 1.006) / 2);

      for (let col = 0; col <= row; col++) {
        const rowZ = startZ + col * BALL_DIAMETER * 1.006;
        const num = RACK_NUMBERS[ballIdx++];
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
        });
      }
    }

    return states;
  }, []);

  // Live mutable 3D states
  const currentStates = useRef<BallState3D[]>(
    initialBallStates.map((s) => ({
      ...s,
      quaternion: s.quaternion.clone(),
      angularVel: s.angularVel.clone(),
    }))
  );

  // Reset ball rack to starting positions
  const resetRack = () => {
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
    isStruckRef.current = false;
    strikeRandomAngleRef.current = (Math.random() - 0.5) * 0.05;
    strikeRandomPowerRef.current = 0.95 + Math.random() * 0.15;
  };

  // Initial Camera setup
  useEffect(() => {
    camera.position.set(0, 7.5, 1.4);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Clean up assets on unmount
  useEffect(() => {
    return () => {
      Object.values(ballTextures).forEach((t) => t.dispose());
      feltTexture.dispose();
      sphereGeometry.dispose();
      ballMaterialsRef.current.forEach((m) => m?.dispose());
    };
  }, [ballTextures, feltTexture, sphereGeometry]);

  // Frame Loop (Timeline + 3D Out-of-Screen Explosion Physics)
  useFrame((_, delta) => {
    // FPS counter
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastFpsTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
      onFpsReport?.(fps);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }

    if (isReducedMotion) {
      return;
    }

    const dt = Math.min(delta, 0.033);
    loopTimeRef.current = (loopTimeRef.current + dt) % LOOP_DURATION;
    const t = loopTimeRef.current;

    const cueStickGroup = cueStickRef.current;
    const cueBall = currentStates.current[0];

    // Cue Stick Animation Phases
    if (cueStickGroup) {
      if (t < 1.4) {
        // Setup Hover
        cueStickGroup.visible = true;
        cueStickGroup.position.set(cueBall.x - 1.6, BALL_RADIUS, cueBall.z);
        cueStickGroup.rotation.y = strikeRandomAngleRef.current;
      } else if (t >= 1.4 && t < 2.6) {
        // Smooth Pullback
        const progress = (t - 1.4) / 1.2;
        const ease = Math.sin((progress * Math.PI) / 2);
        cueStickGroup.position.set(cueBall.x - 1.6 - ease * 0.85, BALL_RADIUS, cueBall.z);
      } else if (t >= 2.6 && t < 2.95) {
        // Rapid Forward Snap Strike
        const progress = (t - 2.6) / 0.35;
        cueStickGroup.position.set(cueBall.x - 1.6 - (1 - progress) * 0.85, BALL_RADIUS, cueBall.z);
      } else {
        // Hide cue stick after impact
        cueStickGroup.visible = false;
      }
    }

    // Trigger Break Impact at t = 2.95s
    if (t >= 2.95 && !isStruckRef.current) {
      isStruckRef.current = true;
      const power = 16.0 * strikeRandomPowerRef.current;
      const angle = strikeRandomAngleRef.current;
      cueBall.vx = Math.cos(angle) * power;
      cueBall.vz = Math.sin(angle) * power;
    }

    // Slow motion effect during break impact (2.95s to 3.45s)
    let timeScale = 1.0;
    if (t >= 2.95 && t < 3.45) {
      timeScale = 0.35;
    }

    // Sub-stepped 3D Physics (including vertical Y-launch for Out-Of-Screen pop!)
    const subSteps = 12;
    const subDt = (dt * timeScale) / subSteps;
    const gravity = -9.81;

    for (let step = 0; step < subSteps; step++) {
      // 1. Position update & 3D gravity
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

          // Apply Gravity if ball is airborne
          if (b.y > BALL_RADIUS) {
            b.vy += gravity * subDt;
          } else {
            b.y = BALL_RADIUS;
            if (b.vy < 0) {
              b.vy = -b.vy * 0.4; // Table bounce
              if (Math.abs(b.vy) < 0.2) b.vy = 0;
            }
          }

          // Rolling / Air Friction Damping
          b.vx *= 1 - 0.9 * subDt;
          b.vz *= 1 - 0.9 * subDt;

          // 3D Quaternion Rotation
          const rotX = b.vz / BALL_RADIUS;
          const rotZ = -b.vx / BALL_RADIUS;
          const rotY = b.angularVel.y;

          const rotVec = new THREE.Vector3(rotX, rotY, rotZ);
          const rotLen = rotVec.length();
          if (rotLen > 0.0001) {
            const deltaRot = new THREE.Quaternion().setFromAxisAngle(
              rotVec.clone().normalize(),
              rotLen * subDt
            );
            b.quaternion.multiplyQuaternions(deltaRot, b.quaternion);
          }
        } else {
          b.vx = 0;
          b.vy = 0;
          b.vz = 0;
        }

        // Cushion Wall Collisions
        if (b.x < TABLE_MIN_X + BALL_RADIUS) {
          b.x = TABLE_MIN_X + BALL_RADIUS;
          b.vx = -b.vx * 0.88;
        }
        if (b.x > TABLE_MAX_X - BALL_RADIUS) {
          b.x = TABLE_MAX_X - BALL_RADIUS;
          b.vx = -b.vx * 0.88;
        }
        if (b.z < TABLE_MIN_Z + BALL_RADIUS) {
          b.z = TABLE_MIN_Z + BALL_RADIUS;
          b.vz = -b.vz * 0.88;
        }
        if (b.z > TABLE_MAX_Z - BALL_RADIUS) {
          b.z = TABLE_MAX_Z - BALL_RADIUS;
          b.vz = -b.vz * 0.88;
        }
      }

      // 2. Ball-to-Ball 3D Collisions & Vertical "Out of Screen" Pop Launch
      for (let i = 0; i < currentStates.current.length; i++) {
        for (let j = i + 1; j < currentStates.current.length; j++) {
          const b1 = currentStates.current[i];
          const b2 = currentStates.current[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dz = b2.z - b1.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < BALL_DIAMETER * BALL_DIAMETER && distSq > 0.00001) {
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

            // Relative Velocity along collision normal
            const rvx = b2.vx - b1.vx;
            const rvy = b2.vy - b1.vy;
            const rvz = b2.vz - b1.vz;
            const velNormal = rvx * nx + rvy * ny + rvz * nz;

            if (velNormal < 0) {
              const restitution = 0.95;
              const impulse = -(1 + restitution) * velNormal * 0.5;

              b1.vx -= nx * impulse;
              b1.vy -= ny * impulse;
              b1.vz -= nz * impulse;

              b2.vx += nx * impulse;
              b2.vy += ny * impulse;
              b2.vz += nz * impulse;

              // High energy impact launches balls upward ("OUT OF SCREEN" 3D POP EFFECT!)
              if (Math.abs(impulse) > 2.5) {
                const launchForce = (Math.abs(impulse) - 2.5) * 0.35;
                if (i === 0 || Math.random() > 0.3) {
                  b1.vy += launchForce * (0.8 + Math.random() * 0.8);
                  b2.vy += launchForce * (0.8 + Math.random() * 0.8);

                  // Add 3D spin vector
                  b1.angularVel.set(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15
                  );
                  b2.angularVel.set(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15
                  );
                }
              }
            }
          }
        }
      }
    }

    // Opacity Fade & Reset Handler (8.5s - 12.0s)
    let ballOpacity = 1.0;
    if (t >= 8.5 && t < 10.0) {
      // Fade out
      ballOpacity = Math.max(0, 1.0 - (t - 8.5) / 1.5);
    } else if (t >= 10.0 && t < 10.1) {
      // Reset behind opacity 0
      resetRack();
      ballOpacity = 0.0;
    } else if (t >= 10.1) {
      // Fade back in
      ballOpacity = Math.min(1.0, (t - 10.1) / 1.9);
    }

    // Sync Mesh Positions, Quaternions & Opacities
    currentStates.current.forEach((state, i) => {
      const mesh = ballMeshRefs.current[i];
      const mat = ballMaterialsRef.current[i];

      if (mesh) {
        mesh.position.set(state.x, state.y, state.z);
        mesh.quaternion.copy(state.quaternion);
      }

      if (mat) {
        mat.opacity = ballOpacity;
        mat.transparent = ballOpacity < 0.99;
      }
    });

    // Camera 3D Push-In & Impact Shake
    let camShakeX = 0;
    let camShakeZ = 0;
    let camShakeY = 0;

    if (t >= 2.95 && t < 3.4) {
      const shakeDecay = 1.0 - (t - 2.95) / 0.45;
      camShakeX = (Math.random() - 0.5) * 0.12 * shakeDecay;
      camShakeZ = (Math.random() - 0.5) * 0.12 * shakeDecay;
      camShakeY = (Math.random() - 0.5) * 0.06 * shakeDecay;
    }

    const camDrift = Math.sin((t / LOOP_DURATION) * Math.PI * 2) * 0.25;
    camera.position.set(camDrift + camShakeX, 7.5 + camShakeY, 1.4 + camShakeZ);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Lighting setup matching photo shadows & glossy highlights */}
      <ambientLight intensity={0.45} color="#E2E8F0" />

      {/* Main Overhead Spotlight */}
      <spotLight
        position={[0, 9.5, 0]}
        angle={0.65}
        penumbra={0.55}
        intensity={3.0}
        color="#FEFCF8"
        castShadow={!isLowEnd}
        shadow-mapSize-width={isLowEnd ? 256 : 512}
        shadow-mapSize-height={isLowEnd ? 256 : 512}
        shadow-bias={-0.0001}
      />

      {/* Deep Emerald Green Felt Table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={!isLowEnd}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial
          map={feltTexture}
          color="#003D27"
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>

      {/* Dark Mahogany Cushion Border Frame */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[10.6, 0.2, 6.6]} />
        <meshStandardMaterial color="#1E130B" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Wooden Cue Stick */}
      <group ref={cueStickRef} position={[CUE_START_X - 1.6, BALL_RADIUS, 0]}>
        {/* Shaft */}
        <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.035, 2.4, 16]} />
          <meshStandardMaterial color="#D4A373" roughness={0.3} />
        </mesh>
        {/* Ferrule */}
        <mesh position={[-0.015, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.04, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Tip */}
        <mesh position={[0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.01, 16]} />
          <meshStandardMaterial color="#2563EB" roughness={0.8} />
        </mesh>
      </group>

      {/* 16 Pool Balls (Solids, Stripes & Cue Ball) */}
      <group ref={ballGroupRef}>
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
                roughness={0.12}
                metalness={0.06}
                clearcoat={0.98}
                clearcoatRoughness={0.08}
                reflectivity={0.92}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
