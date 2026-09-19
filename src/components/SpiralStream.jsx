// @refresh reset
//Abhi tumne ek cube ka movement samjha. Is file mein samjhoge ki 110 cubes milkar ek complete stream kaise banate hain.
import { Line, useTexture } from "@react-three/drei";
import { useState } from "react";
import { getSpiralPosition } from "../spiral";
import { CUBES_PER_STREAM } from "../config/streams";
import SpiralCube from "./SpiralCube";

function SpiralStream({ color, matcap: image, phase }) {
  const matcap = useTexture(image);
  const [cubes] = useState(() => //har cube ki information
    Array.from({ length: CUBES_PER_STREAM }, (_, index) => ({
      start: index / CUBES_PER_STREAM, //Har cube ko spiral par alag starting progress milti hai. Samajhne ke liye temporarily 5 cubes maan lo
      size: 0.07 + Math.random() * 0.075, //size: har cube thoda different size   
      spin: 0.4 + Math.random(), //spin: apni rotation ki speed
      offset: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
    })),
  );
  const [points] = useState(() => //ribbon draw karne ke addresses
    Array.from({ length: 301 }, (_, index) => getSpiralPosition(index / 300, phase)),
  );

  return (
    <group>
      {/* Transparent wide line + thin bright line: simple luminous ribbon. */}
      <Line points={points} color={color} lineWidth={9} transparent opacity={0.07} depthWrite={false} />
      <Line points={points} color={color} lineWidth={3} transparent opacity={0.2} depthWrite={false} />
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.85} depthWrite={false} />
      {cubes.map((cube, index) => (
        <SpiralCube key={index} {...cube} phase={phase} matcap={matcap} />
      ))}
    </group>
  );
}

export default SpiralStream;
