import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

function Cube({position , color}){
  return (
    <mesh position={position}>
      <boxGeometry/>
      <meshStandardMaterial color={color}/>
    </mesh>
  )
}
const App = () => {
  return (
    <Canvas camera={{ position : [0 , 0 , 5] }} >
      <ambientLight intensity={0.5}/>
      <directionalLight position={[2 , 2, 5]} intensity={2}/>
      <Cube position={[-2 , 0 , 0]} color={"red"}/>
        <Cube
        position={[0, 0, 0]}
        color="orange"
      />

      <Cube
        position={[2, 0, 0]}
        color="blue"
      />
      <OrbitControls/>
    </Canvas>
  )
}

export default App
