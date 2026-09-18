import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Cube({ rotation, position, color }) {
  const cubeRef = useRef()
  
  useFrame((state , delta)=>{
    cubeRef.current.rotation.y += 1 * delta //delta matlab last frame aur current frame ke beech kitna time laga. yaha 2 speed hai spped control kar sakte hai
    cubeRef.current.rotation.x += delta
  })
  return (
    <mesh
      ref={cubeRef}
      rotation={rotation} //isse har cube thoda tilted lagega
      position={position}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} intensity={2} />
      <group position={[0, 1, 0]}>
        <Cube
          rotation={[0, Math.PI / 4, 0]}
          position={[-2, 0, 0]}
          color={"red"}
        />
        <Cube rotation={[0, Math.PI / 4, 0]} position={[0, 0, 0]} color="orange" />
        <Cube rotation={[0, Math.PI / 4, 0]} position={[2, 0, 0]} color="blue" />
      </group>

      <OrbitControls />
    </Canvas>
  );
};

export default App;
