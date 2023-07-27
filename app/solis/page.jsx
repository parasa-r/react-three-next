'use client';

import React, { useState, useRef } from "react"; // Import useState
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import { TextureLoader, AdditiveBlending, DoubleSide, Color } from "three";

const Model = ({ activeTexture }) => { // Accept activeTexture as prop
  const gltf = useLoader(GLTFLoader, "./scene.gltf");
  const { camera } = useThree();

  // Chargez les textures
  const texture1 = useLoader(TextureLoader, './textures/iPhone-14-Plus-deep-purple.jpg');
  const texture2 = useLoader(TextureLoader, './textures/Wallpaper_baseColor.jpeg');

  const meshRef = useRef();
  camera.position.z = -5; // Par exemple, ajustez cette valeur selon la taille de votre modèle et votre souhait de proximité.
  camera.lookAt(0, 0, 0); 

  gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === 'Body_Wallpaper_0') {
      child.material.map = activeTexture === 1 ? texture1 : texture2;
     // child.material.roughness = 0.4; // Rendre l'objet moins réfléchissant
      child.material.roughness = 2;
     // child.material.emissive = new Color(-0.2, -0.2, -0.2); // Rendre le matériau légèrement lumineux
      child.material.needsUpdate = true;
    }
  });

 //const [isRotatingForward, setIsRotatingForward] = useState(true);

  const maxRotation = Math.PI / 6;  // 30 degrés en radians
  const rotationSpeed = 0.01;  // vitesse de rotation

  useFrame(() => {
    if (meshRef.current) {
       meshRef.current.rotation.y += rotationSpeed;
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

  return (
    <div className="flex flex-col md:flex-row h-screen items-center bg-gray-100 dark:bg-black">
      <div className="md:w-1/2 p-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 dark:text-white">We create applications</h1>
        <p className="text-xl md:text-2xl mb-6 dark:text-white">High-end applications for companies that think big - your success is our priority.</p>
        <button 
          onClick={() => setActiveTexture(prev => (prev === 1 ? 2 : 1))} 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
        >
          Change le background
        </button>
      </div>
      <div className="md:w-1/2 h-screen">
        <Canvas className="w-full h-full">
          <ambientLight intensity={4} />
          <pointLight position={[-10, 10, 10]} intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, 10]} intensity={1} />
          <pointLight position={[10, -10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <Model activeTexture={activeTexture} />
          </Suspense>
          
        </Canvas>
      </div>
    </div>
  );
}
