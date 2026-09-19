// @refresh reset
import { useState } from "react";

function SpaceDust() {
  const [particles] = useState(() =>
    Array.from({ length: 180 }, () => ({
      position: [(Math.random() - 0.5) * 26, (Math.random() - 0.5) * 20, -5 - Math.random() * 8],
      size: 0.008 + Math.random() * 0.018,
    })),
  );
  return particles.map((particle, index) => (
    <mesh key={index} position={particle.position} scale={particle.size}>
      <boxGeometry />
      <meshBasicMaterial color="#a6b3c8" />
    </mesh>
  ));
}

export default SpaceDust;
