import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { VehiclePart } from "../enums/vehiclePart";
import { WINDOW_PARTS } from "../enums/windowParts";
import type { WindowState } from "../types/windows";

interface VochoModelProps {
  windowPositions: WindowState;
  onWindowSelect?: (side: "driver" | "passenger") => void;
  onOtherPartSelect?: () => void;
}

const WINDOW_TRAVEL = 1.2;

export default function VochoModel({
  windowPositions,
  onWindowSelect,
  onOtherPartSelect,
}: VochoModelProps) {
  const { scene } = useGLTF("/models/vochoGris.glb");
  const baseY = useRef(new Map<string, number>());

  useFrame(() => {
    const windowNodes = [
      { name: "polySurface329_blinn_negro_0", position: windowPositions.driver },
      { name: "polySurface331_blinn_negro_0", position: windowPositions.passenger },
    ];

    for (const windowNode of windowNodes) {
      const object = scene.getObjectByName(windowNode.name);
      if (!object) continue;

      if (!baseY.current.has(windowNode.name)) {
        baseY.current.set(windowNode.name, object.position.y);
      }

      const closedY = baseY.current.get(windowNode.name) ?? object.position.y;
      const targetY = closedY - ((100 - windowNode.position) / 100) * WINDOW_TRAVEL;
      object.position.y += (targetY - object.position.y) * 0.12;
    }
  });

  

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const object = event.object.name;

    const selectedPart = Object.entries(VehiclePart).find(
          ([modelPartName]) => modelPartName === object,
        );

    console.log("Clicked on part:", selectedPart?.[1] ?? object);

     if (selectedPart?.[1] === WINDOW_PARTS.driver) {
        onWindowSelect?.("driver")
        return    
    }

    if (selectedPart?.[1] === WINDOW_PARTS.passenger) {
        onWindowSelect?.("passenger")
        return    
    }

    onOtherPartSelect?.();
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
useGLTF.preload("/models/vochoGris.glb");
