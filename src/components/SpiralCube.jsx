// @refresh reset
// Cube ko spiral par aage chalao, thoda idhar-udhar rakho, rotate karo aur size update karo.
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { getSpiralPosition } from "../spiral";

function SpiralCube({ start, phase, matcap, size, spin, offset }) {
  const cubeRef = useRef();
  const progressRef = useRef(start);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((_, delta) => {
    // Har second same distance in progress; end par fingertip se restart.
    progressRef.current = (progressRef.current + delta * 0.035) % 1; //1 kyun,  Progress ko 0 se 1 ke andar loop karna hai.
    const progress = progressRef.current;
    const [x, y, z] = getSpiralPosition(progress, phase);
    const scatter = Math.sin(progress * Math.PI) * 0.24;
    cubeRef.current.position.set(
      x + offset[0] * scatter,
      y + offset[1] * scatter,
      z + offset[2] * scatter,
    );
    cubeRef.current.rotation.x += spin * delta;
    cubeRef.current.rotation.y += spin * delta * 0.8;
    // Dono ends par shrink: restart ka sudden jump less visible hota hai.
    const fade = Math.min(1, progress * 35, (1 - progress) * 18);
    cubeRef.current.scale.setScalar(
      size * (0.3 + progress * 1.5) * fade * (clicked ? 1.5 : 1),
    );
  });

  return (
    <mesh
      ref={cubeRef}
      position={getSpiralPosition(start, phase)}
      scale={0}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation();
        setClicked((previous) => !previous);
      }}
    >
      <boxGeometry />
      <meshMatcapMaterial matcap={matcap} color={hovered ? "#ffc1df" : "white"} />
    </mesh>
  );
}

export default SpiralCube;
