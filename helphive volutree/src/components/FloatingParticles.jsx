import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";

function ParticleField() {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(1800);
    for (let i = 0; i < 1800; i += 3) {
      p[i] = (Math.random() - 0.5) * 18;
      p[i + 1] = (Math.random() - 0.5) * 12;
      p[i + 2] = (Math.random() - 0.5) * 14;
    }
    return p;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#7fffd4"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
