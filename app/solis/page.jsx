'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"; // Import useState
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshDistortMaterial } from '@react-three/drei'
import { Suspense } from "react";
import { Clock } from 'three';


const Loading = () => {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshBasicMaterial  color="orange" transparent opacity={0.9} />
    </mesh>
  );
};


import { TextureLoader} from "three";
const clock = new Clock();
const Sun = ({ scrollValue }) => {
    const meshRef = useRef();
    

   useFrame(() => {
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.002;

        const time = clock.getElapsedTime();
        const positions = meshRef.current.geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const px = positions.getX(i);
            const py = positions.getY(i);
            const pz = positions.getZ(i);

            const len = Math.sqrt(px*px + py*py + pz*pz);
            const offset = 0.5 * Math.sin(len + time);
            
            const ratio = (3 + offset) / len;
            positions.setXYZ(i, px*ratio, py*ratio, pz*ratio);
        }

        positions.needsUpdate = true;
        meshRef.current.geometry.computeVertexNormals();
    }
});


    return (
        <mesh ref={meshRef} position={[0, scrollValue * 0.005, 5]} rotation={[0, 0, Math.PI / 2]}>
            <sphereBufferGeometry attach="geometry" args={[3, 32, 32]} />
            <MeshDistortMaterial roughness={10} color={'orange'} />
        </mesh>
    );
};



const Model = ({ activeTexture }) => {
  const gltf = useLoader(GLTFLoader, "./scene.gltf");
  const { camera } = useThree();

 const texture1 = useLoader(TextureLoader, './textures/iPhone-14-Plus-deep-purple.jpg');
const texture2 = useLoader(TextureLoader, './textures/Wallpaper_baseColor.jpeg');

  const meshRef = useRef();
  camera.position.z = -5; 
  camera.lookAt(0, 0, 0); 

  gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === 'Body_Wallpaper_0') {
      child.material.map = activeTexture === 1 ? texture1 : texture2;
      child.material.roughness = 2;
      child.material.needsUpdate = true;
    }
  });

  const maxRotation = Math.PI / 4;  
  const [elapsedTime, setElapsedTime] = useState(0);

  useFrame(() => {
    if (meshRef.current) {
      setElapsedTime((prevTime) => prevTime + 0.001);

       // Pivoter légèrement sur l'axe X
      meshRef.current.rotation.z = maxRotation * Math.sin(elapsedTime);
       meshRef.current.rotation.x = maxRotation * Math.sin(elapsedTime);
      
      // Flotter sur l'axe Y
      //s
      //meshRef.current.position.y = -scrollValue * 0.01 + 0.2 * Math.sin(elapsedTime);
    }
  });

  return (
    <>
      <primitive ref={meshRef} object={gltf.scene} scale={4} />
    </>
  );
};

export default function App() {
  
  const [activeTexture, setActiveTexture] = useState(1); // 1 for texture1 and 2 for texture2
  const [scrollValue, setScrollValue] = useState(0);
  const ref = useRef()
 
  const handleScroll = useCallback(() => {
  if (ref.current) {
    const currentScrollValue = ref.current.scrollTop;
    window.requestAnimationFrame(() => {
      setScrollValue(currentScrollValue);
    });
  }
}, []);



  useEffect(() => {
    const div = ref.current;
    if (div) {
        div.addEventListener("scroll", handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            div.removeEventListener("scroll", handleScroll);
        };
    }
}, [handleScroll]);

  return (
   <div className="flex flex-col h-full bg-gray-100 overflow-y-auto dark:bg-black" ref={ref}>
      <div className="flex flex-col md:flex-row h-screen items-center">
        <div className="md:w-1/2 p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">We create applications</h1>
          <p className="text-xl md:text-2xl mb-6">High-end applications for companies that think big - your success is our priority.</p>
          <button 
            onClick={() => setActiveTexture(prev => (prev === 1 ? 2 : 1))} 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
          >
            Change le background
          </button>
        </div>
        <div className="md:w-1/2 h-screen">
          <Canvas className="fixed top-0 left-0 w-full h-screen z-10">
            <ambientLight intensity={2} />
            <pointLight position={[-10, 10, 10]} intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, 10]} intensity={1}  />
            <pointLight position={[10, -10, 10]} intensity={1} />
    
            <Suspense fallback={<Loading />}>
              <Sun scrollValue={scrollValue} />
              <Model activeTexture={activeTexture} scrollValue={scrollValue} />
            </Suspense>
            
          </Canvas>
        </div>
      </div>

      {/* New Section: Our story */}
      <div className="flex flex-col items-center py-32 bg-gray-200 z-0">
        <h2 className="text-5xl font-bold mb-8">Our Story</h2>
        <p className="text-xl md:text-2xl mb-6 max-w-3xl text-center">From our humble beginnings in a garage to becoming a global leader in application development, our journey has been nothing short of spectacular. We believe in pushing the boundaries of innovation and delivering solutions that make a difference.</p>
      </div>

    </div>

  );
}
