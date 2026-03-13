import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";

function GlobeMesh() {
  const mesh = useRef();

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.35;
      mesh.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 64, 64]} scale={1.15}>
      <MeshDistortMaterial
        color="#29d3a6"
        roughness={0.22}
        metalness={0.7}
        distort={0.18}
        speed={2}
      />
    </Sphere>
  );
}

export default function RotatingGlobe() {
  return (
    <div className="h-28 w-28 md:h-36 md:w-36">
      <Canvas camera={{ position: [0, 0, 3.2] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 2, 3]} intensity={1.2} />
        <GlobeMesh />
      </Canvas>
    </div>
  );
}
