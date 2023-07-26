'use client';

import React, { useState, useRef } from "react"; // Import useState
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import { TextureLoader } from "three";


const Model = ({ activeTexture }) => { // Accept activeTexture as prop
  const gltf = useLoader(GLTFLoader, "./scene.gltf");

  // Chargez les textures
  const texture1 = useLoader(TextureLoader, './textures/iPhone-14-Plus-deep-purple.jpg');
  const texture2 = useLoader(TextureLoader, './textures/Wallpaper_baseColor.jpeg');

  const meshRef = useRef();

  gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === 'Body_Wallpaper_0') {
      child.material.map = activeTexture === 1 ? texture1 : texture2;
     // child.material.roughness = 0.4; // Rendre l'objet moins réfléchissant
      child.material.roughness = 2;
     // child.material.emissive = new Color(-0.2, -0.2, -0.2); // Rendre le matériau légèrement lumineux
      child.material.needsUpdate = true;
    }
  });

  useFrame(({ mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = mouse.y / 4;  // inclinaison légère sur l'axe x
      meshRef.current.rotation.y = mouse.x / 4 + Math.PI;  // inclinaison légère sur l'axe y
    }
  });

  return (
    <>
      <primitive ref={meshRef} object={gltf.scene} scale={4}  />
    </>
  );
};

export default function App() {
  const [activeTexture, setActiveTexture] = useState(1); // 1 for texture1 and 2 for texture2

  const buttonStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1000,  // assurez-vous qu'il est au-dessus des autres éléments
    background: 'white',
    color: 'black',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <Model activeTexture={activeTexture} />
          <OrbitControls />
          <Environment preset='studio' background />
        </Suspense>
      </Canvas>
      <button style={buttonStyle} onClick={() => setActiveTexture(prev => (prev === 1 ? 2 : 1))}>
        Change le background
      </button>
    </>
  );
}
