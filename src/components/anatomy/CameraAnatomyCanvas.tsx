"use client";

import { ContactShadows, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import {
  Color,
  Group,
  MathUtils,
  MeshStandardMaterial,
  type Mesh,
  type Object3D,
} from "three";
import {
  activePartId,
  chapterWeight,
  explodeAmount,
  type PartId,
} from "./anatomyTimeline";

const MODEL = "/media/anatomy/3d/security_camera_02_1k.gltf";

type ProgressRef = MutableRefObject<number>;

function PolyHavenCamera({ progressRef }: { progressRef: ProgressRef }) {
  const { scene } = useGLTF(MODEL);
  const root = useRef<Group>(null);
  const mountRef = useRef<Object3D | null>(null);
  const bodyRef = useRef<Object3D | null>(null);
  const bodyMats = useRef<MeshStandardMaterial[]>([]);

  const clone = useMemo(() => {
    const next = scene.clone(true);
    const mats: MeshStandardMaterial[] = [];
    next.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => {
          const cloned = (m as MeshStandardMaterial).clone();
          mats.push(cloned);
          return cloned;
        });
      } else if (mesh.material) {
        const cloned = (mesh.material as MeshStandardMaterial).clone();
        mats.push(cloned);
        mesh.material = cloned;
      }
    });
    bodyMats.current = mats;
    mountRef.current = next.getObjectByName("security_camera_02_mount") ?? null;
    bodyRef.current = next.getObjectByName("security_camera_02") ?? null;
    return next;
  }, [scene]);

  useFrame(() => {
    const p = progressRef.current;
    const t = explodeAmount(p);
    const mountW = chapterWeight(p, "mount");
    const houseW = chapterWeight(p, "housing");

    if (root.current) {
      root.current.rotation.y = MathUtils.lerp(0.65, -0.55, t);
      root.current.rotation.x = MathUtils.lerp(0.12, -0.18, t);
      root.current.position.y = MathUtils.lerp(-0.06, 0.02, t);
    }

    if (mountRef.current) {
      const open = Math.max(t * 0.55, mountW);
      mountRef.current.position.y = MathUtils.lerp(0, 0.2, open);
      mountRef.current.position.z = MathUtils.lerp(0, -0.16, open);
      mountRef.current.rotation.x = MathUtils.lerp(0, -0.12, open);
    }

    if (bodyRef.current) {
      const open = Math.max(t * 0.4, houseW * 0.85);
      bodyRef.current.position.y = MathUtils.lerp(0, -0.05, open);
      bodyRef.current.position.z = MathUtils.lerp(0, 0.18, open);
    }

    // Soften the shell as internals come out so IR / lens / sensor read clearly.
    const shellFade = MathUtils.clamp((p - 0.4) / 0.35, 0, 1);
    for (const mat of bodyMats.current) {
      mat.transparent = true;
      mat.depthWrite = shellFade < 0.55;
      mat.opacity = MathUtils.lerp(1, 0.28, shellFade);
    }
  });

  return (
    <group ref={root} position={[0, -0.04, 0]} scale={1.45}>
      <primitive object={clone} />
    </group>
  );
}

function InternalParts({ progressRef }: { progressRef: ProgressRef }) {
  const group = useRef<Group>(null);
  const ir = useRef<Group>(null);
  const lens = useRef<Group>(null);
  const sensor = useRef<Group>(null);

  const mats = useMemo(() => {
    return {
      ring: new MeshStandardMaterial({
        color: new Color("#151515"),
        metalness: 0.55,
        roughness: 0.35,
      }),
      led: new MeshStandardMaterial({
        color: new Color("#ffcc4d"),
        emissive: new Color("#ffb020"),
        emissiveIntensity: 0.9,
        roughness: 0.3,
      }),
      glass: new MeshStandardMaterial({
        color: new Color("#d7e8f7"),
        metalness: 0.05,
        roughness: 0.08,
        transparent: true,
        opacity: 0.62,
      }),
      barrel: new MeshStandardMaterial({
        color: new Color("#8a93a0"),
        metalness: 0.7,
        roughness: 0.28,
      }),
      pcb: new MeshStandardMaterial({
        color: new Color("#1a7a42"),
        metalness: 0.15,
        roughness: 0.5,
      }),
      chip: new MeshStandardMaterial({
        color: new Color("#0d0d0d"),
        metalness: 0.65,
        roughness: 0.25,
      }),
      pad: new MeshStandardMaterial({
        color: new Color("#c9a227"),
        metalness: 0.8,
        roughness: 0.35,
      }),
    };
  }, []);

  const leds = useMemo(() => {
    const items: { x: number; y: number }[] = [];
    for (let i = 0; i < 14; i += 1) {
      const a = (i / 14) * Math.PI * 2;
      items.push({ x: Math.cos(a) * 0.048, y: Math.sin(a) * 0.048 });
    }
    return items;
  }, []);

  useFrame(() => {
    const p = progressRef.current;
    const irW = chapterWeight(p, "ir");
    const lensW = chapterWeight(p, "lens");
    const sensorW = chapterWeight(p, "sensor");
    const reveal = MathUtils.clamp((p - 0.36) / 0.22, 0, 1);

    if (group.current) {
      group.current.visible = reveal > 0.02;
      group.current.scale.setScalar(MathUtils.lerp(0.2, 1, reveal));
      group.current.position.set(0.01, -0.01, MathUtils.lerp(0.05, 0.2, reveal));
    }

    const active = activePartId(p);

    if (ir.current) {
      ir.current.position.set(
        0,
        MathUtils.lerp(0.02, 0.14, Math.max(reveal * 0.35, irW)),
        MathUtils.lerp(0.02, 0.05, irW),
      );
      const irFocus = active === "ir" ? 1 : 0.55 + irW * 0.25;
      ir.current.scale.setScalar((0.9 + irW * 0.2) * irFocus);
      ir.current.visible = reveal > 0.02 && (active !== "sensor" || irW > 0.3);
    }
    if (lens.current) {
      lens.current.position.set(
        0,
        MathUtils.lerp(-0.01, 0.01, lensW),
        MathUtils.lerp(0.05, 0.22, Math.max(reveal * 0.4, lensW)),
      );
      const lensFocus = active === "lens" ? 1.08 : 0.72 + lensW * 0.2;
      lens.current.scale.setScalar((0.9 + lensW * 0.2) * lensFocus);
    }
    if (sensor.current) {
      sensor.current.position.set(
        0,
        MathUtils.lerp(-0.05, -0.18, Math.max(reveal * 0.45, sensorW)),
        MathUtils.lerp(0.08, 0.38, Math.max(reveal * 0.45, sensorW)),
      );
      const sensorFocus = active === "sensor" ? 1.12 : 0.7 + sensorW * 0.2;
      sensor.current.scale.setScalar((0.88 + sensorW * 0.22) * sensorFocus);
    }

    // Bright LEDs only while IR is the active chapter — stops false highlights.
    mats.led.emissiveIntensity =
      active === "ir" ? 0.5 + irW * 1.3 : 0.12 + irW * 0.2;
    mats.glass.opacity = active === "lens" ? 0.78 : 0.4;
    mats.pcb.color.set(active === "sensor" ? "#22a055" : "#145c34");
  });

  return (
    <group ref={group}>
      <group ref={ir}>
        <mesh material={mats.ring} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.048, 0.009, 14, 40]} />
        </mesh>
        {leds.map((led, index) => (
          <mesh
            key={index}
            material={mats.led}
            position={[led.x, led.y, 0.007]}
            scale={[0.007, 0.007, 0.004]}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        ))}
      </group>

      <group ref={lens}>
        <mesh material={mats.barrel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.038, 0.028, 28]} />
        </mesh>
        <mesh
          material={mats.glass}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0.012]}
        >
          <sphereGeometry args={[0.028, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>

      <group ref={sensor}>
        <mesh material={mats.pcb}>
          <boxGeometry args={[0.11, 0.008, 0.08]} />
        </mesh>
        <mesh material={mats.chip} position={[0, 0.008, 0]}>
          <boxGeometry args={[0.032, 0.007, 0.032]} />
        </mesh>
        <mesh material={mats.pad} position={[-0.038, 0.006, 0.022]} scale={0.008}>
          <boxGeometry args={[1, 0.4, 1]} />
        </mesh>
        <mesh material={mats.pad} position={[0.04, 0.006, -0.02]} scale={0.008}>
          <boxGeometry args={[1, 0.4, 1]} />
        </mesh>
      </group>
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: ProgressRef }) {
  const { camera } = useThree();
  useFrame(() => {
    const t = explodeAmount(progressRef.current);
    const active = activePartId(progressRef.current);
    const zoom =
      active === "sensor"
        ? 0.12
        : active === "lens"
          ? 0.08
          : active === "ir"
            ? 0.05
            : 0;
    camera.position.x = MathUtils.lerp(1.05, 0.72, t) - zoom * 0.4;
    camera.position.y = MathUtils.lerp(0.42, 0.28, t) + zoom * 0.15;
    camera.position.z = MathUtils.lerp(2.05, 1.55, t) - zoom;
    camera.lookAt(0, 0.02, 0.05);
  });
  return null;
}

function Scene({ progressRef }: { progressRef: ProgressRef }) {
  return (
    <>
      <color attach="background" args={["#090b0e"]} />
      <fog attach="fog" args={["#090b0e", 4.5, 9]} />
      <ambientLight intensity={0.4} />
      <hemisphereLight intensity={0.4} color="#e8eef8" groundColor="#090b0e" />
      <directionalLight
        castShadow
        intensity={1.55}
        position={[2.8, 3.6, 2.2]}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight intensity={0.55} position={[-2.4, 1.8, -1.2]} />
      <pointLight intensity={0.65} position={[0.2, 0.4, 0.8]} color="#8eb7ff" />

      <CameraRig progressRef={progressRef} />

      <group>
        <PolyHavenCamera progressRef={progressRef} />
        <InternalParts progressRef={progressRef} />
      </group>

      <ContactShadows
        position={[0, -0.32, 0]}
        opacity={0.5}
        scale={4}
        blur={2.6}
        far={2}
      />
    </>
  );
}

export function CameraAnatomyCanvas({
  progressRef,
}: {
  progressRef: ProgressRef;
  labels?: Record<PartId, string>;
}) {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [1.05, 0.42, 2.05], fov: 30, near: 0.01, far: 40 }}
      gl={{ antialias: true, alpha: false }}
    >
      <Suspense fallback={null}>
        <Scene progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL);
