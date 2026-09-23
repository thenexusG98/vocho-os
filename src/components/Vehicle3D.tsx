import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";

interface VochoModelProps {
  onClickPart?: (partName: string) => void; 
}

export default function VochoModel({ onClickPart }: VochoModelProps) {
  //vocho azul
  //const { scene } = useGLTF("/models/vocho.gltf");
  //vocho gris
  const { scene } = useGLTF("/models/vochoGris.glb");

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const object = event.object.name;
    console.log("Clicked on part:", object);
    
    onClickPart?.(object);
  }  

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      onClick={handleClick}
    />
  );
}
 //vocho azul
//useGLTF.preload("/models/vocho.gltf");
//vocho gris
useGLTF.preload("/models/vochoGris.glb");
