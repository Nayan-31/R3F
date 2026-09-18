import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import matcap1 from "./images/matcap1.png";
import matcap2 from "./images/matcap2.jpg";
import matcap3 from "./images/matcap3.jpg";
function Cube({ rotation, position , matcapImage }) {

  const matcap = useTexture(matcapImage)

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
      <meshMatcapMaterial matcap={matcap}/>
    </mesh>
  );
}

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <group position={[0, 0, 1]}>
        <Cube
          matcapImage={matcap1}
          rotation={[0, Math.PI / 4, 0]}
          position={[-2, 0, 0]}
          color={"red"}
        />
        <Cube
           matcapImage={matcap3}
           rotation={[0, Math.PI / 4, 0]} 
           position={[0, 0, 0]} 
           color="orange" 
        />
        <Cube 
        matcapImage={matcap2}
        rotation={[0, Math.PI / 4, 0]} 
        position={[2, 0, 0]} 
        color="blue" 
        />
      </group>
     <OrbitControls/>
    </Canvas>
  );
};

export default App;
