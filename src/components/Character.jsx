// @refresh reset
import { useGLTF } from "@react-three/drei";

function Character() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/character/scene.gltf`);
  return <primitive object={scene} position={[-0.5, -3.8, 0]} scale={1.2} />;
}

export default Character;
