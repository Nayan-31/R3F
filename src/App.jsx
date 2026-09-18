import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";

function Cube({ rotation, position, color }) {
  const cubeRef = useRef()
  const[hovered , setHovered] = useState(false)
  const[clicked , setClicked] = useState(false)

  useFrame((state , delta)=>{
    cubeRef.current.rotation.y += 1 * delta //delta matlab last frame aur current frame ke beech kitna time laga. yaha 1 speed hai spped control kar sakte hai
    cubeRef.current.rotation.x += delta
  })
  return (
    <mesh
      ref={cubeRef}
      rotation={rotation} //isse har cube thoda tilted lagega
      position={position}

      onPointerOver={()=>setHovered(true)}
      onPointerOut={()=>setHovered(false)}

      onClick={()=>setClicked(!clicked)}

      scale={clicked ? 1.5 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : color} />
    </mesh>
  );
}

function CameraController(){
  const {camera , pointer} = useThree()
  useFrame(()=>{
  camera.position.x = pointer.x * 0.5
  camera.position.y = pointer.y * 0.5
  })
  return null
}
const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />

      <directionalLight position={[2, 2, 5]} intensity={2} />

      <group position={[0, 0, 1]}>
        <Cube
          rotation={[0, Math.PI / 4, 0]}
          position={[-2, 0, 0]}
          color={"red"}
        />
        <Cube rotation={[0, Math.PI / 4, 0]} position={[0, 0, 0]} color="orange" />
        <Cube rotation={[0, Math.PI / 4, 0]} position={[2, 0, 0]} color="blue" />
      </group>
      <CameraController/>
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default App;
