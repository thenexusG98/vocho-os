import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { VehiclePart } from "../enums/vehiclePart";
import { WINDOW_PARTS } from "../enums/windowParts";
import type { WindowState } from "../types/windows";

interface VochoModelProps {
  windowPositions: WindowState;
  lights?: boolean;
  selectedHeadlight?: "faro_izquierdo" | "faro_derecho" | null;
  enablePartSelection?: boolean;
  onModelClick?: () => void;
  onHeadlightSelect?: (headlight: "faro_izquierdo" | "faro_derecho") => void;
  onWindowSelect?: (side: "driver" | "passenger") => void;
  onOtherPartSelect?: () => void;
}

const WINDOW_TRAVEL = 1.2;

export default function VochoModel({
  windowPositions,
  lights = false,
  selectedHeadlight = null,
  enablePartSelection = true,
  onModelClick,
  onHeadlightSelect,
  onWindowSelect,
  onOtherPartSelect,
}: VochoModelProps) {
  const { scene } = useGLTF("/models/vochoGris.glb");
  const model = scene;
  const baseY = useRef(new Map<string, number>());

  useEffect(() => {
    const headlights = [
      { part: "faro_izquierdo", node: "polySurface264_lmb_Faros_0" },
      { part: "faro_derecho", node: "polySurface266_lmb_Faros_0" },
    ] as const;

    for (const headlight of headlights) {
      const object = model.getObjectByName(headlight.node);
      if (!object) continue;

      object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        for (const material of materials) {
          if (!(material as THREE.Material & { color?: THREE.Color }).color) {
            continue;
          }

          const colorMaterial = material as THREE.Material & {
            color: THREE.Color;
            emissive?: THREE.Color;
            emissiveIntensity?: number;
          };
          const originalColor =
            (colorMaterial.userData.originalColor as THREE.Color | undefined) ??
            colorMaterial.color.clone();
          colorMaterial.userData.originalColor = originalColor;

          const isOn = lights || selectedHeadlight === headlight.part;
          
          if (isOn) {
            colorMaterial.color.set("#ffff00");
            if (colorMaterial.emissive) {
              colorMaterial.emissive.set("#ffff00");
              colorMaterial.emissiveIntensity = 1.5;
            }
          } else {
            colorMaterial.color.copy(originalColor);
            if (colorMaterial.emissive) {
              colorMaterial.emissive.set("#000000");
              colorMaterial.emissiveIntensity = 0;
            }
          }
        }
      });
    }
  }, [lights, model, selectedHeadlight]);

  useFrame(() => {
    const windowNodes = [
      { name: "polySurface329_blinn_negro_0", position: windowPositions.driver },
      { name: "polySurface331_blinn_negro_0", position: windowPositions.passenger },
    ];

    for (const windowNode of windowNodes) {
      const object = model.getObjectByName(windowNode.name);
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

    if (!enablePartSelection) {
      onModelClick?.();
      return;
    }

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

    if (selectedPart?.[1] === "faro_izquierdo") {
      onHeadlightSelect?.("faro_izquierdo");
      return;
    }

    if (selectedPart?.[1] === "faro_derecho") {
      onHeadlightSelect?.("faro_derecho");
      return;
    }

    onOtherPartSelect?.();
  }  

  return (
    <primitive
      object={model}
      scale={1}
      position={[0, 0, 0]}
      onClick={enablePartSelection || onModelClick ? handleClick : undefined}
    />
  );
}
useGLTF.preload("/models/vochoGris.glb");
