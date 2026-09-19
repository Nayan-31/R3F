//Ye file chhoti hai. Iska kaam hai saari streams ko ek jagah assemble karke finger ke paas rakhna.

import { EMISSION_POINT, STREAMS } from "../config/streams";
import SpiralStream from "./SpiralStream";

function SpiralStreams() {
  return (
    <group position={EMISSION_POINT}>
      {STREAMS.map((stream) => (
        <SpiralStream key={stream.color} {...stream} />
      ))}
    </group>
  );
}

export default SpiralStreams;
