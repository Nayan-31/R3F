import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Character from "./components/Character";
import SpaceDust from "./components/SpaceDust";
import SpiralStreams from "./components/SpiralStreams";

function App() {
  return (
    <Canvas camera={{ position: [0, 2, 19], fov: 50 }} dpr={[1, 1.5]}>
      <color attach="background" args={["#080c15"]} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 6, 5]} intensity={2} />
      <SpaceDust />
      <Suspense fallback={null}>
        <Character />
        <SpiralStreams />
      </Suspense>
      <OrbitControls target={[0, 1.5, 0]} minDistance={8} maxDistance={30} />
    </Canvas>
  );
}

export default App;
