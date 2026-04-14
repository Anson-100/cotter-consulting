// components/ui/ocean-waves.tsx
"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function WavePlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(18, 10, 128, 64)
    geo.rotateX(-Math.PI / 2.4)

    const uni = {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#312e81") },
      uColor2: { value: new THREE.Color("#6366f1") },
      uColor3: { value: new THREE.Color("#818cf8") },
    }

    return { geometry: geo, uniforms: uni }
  }, [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * 0.4
  })

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -1.5, 0]}>
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying float vElevation;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 pos = position;

            float wave1 = sin(pos.x * 0.6 + uTime * 0.8) * 0.35;
            float wave2 = sin(pos.z * 0.9 + uTime * 0.5) * 0.25;
            float wave3 = sin(pos.x * 1.3 + pos.z * 0.7 + uTime * 0.6) * 0.15;
            float wave4 = cos(pos.x * 2.0 + pos.z * 1.5 + uTime * 1.0) * 0.06;

            pos.y += wave1 + wave2 + wave3 + wave4;
            vElevation = pos.y;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          varying float vElevation;
          varying vec2 vUv;

          void main() {
            float mixFactor = smoothstep(-0.4, 0.5, vElevation);
            vec3 color = mix(uColor1, uColor2, mixFactor);

            float foam = smoothstep(0.3, 0.45, vElevation);
            color = mix(color, uColor3, foam * 0.5);

            float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(0.0, 0.2, 1.0 - vUv.x);
            float topFade = smoothstep(0.0, 0.35, vUv.y);
            float bottomFade = smoothstep(0.0, 0.15, 1.0 - vUv.y);

            gl_FragColor = vec4(color, 0.55 * edgeFade * topFade * bottomFade);
          }
        `}
      />
    </mesh>
  )
}

export default function OceanWaves() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 55%, black 30%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 55%, black 30%, transparent 70%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 3, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <WavePlane />
      </Canvas>
    </div>
  )
}
