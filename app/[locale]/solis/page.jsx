'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"; // Import useState
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshDistortMaterial } from '@react-three/drei'
import { Suspense } from "react";
import { Clock } from 'three';
import { faSun, faMoon, faStar, faCloud, faTree } from '@fortawesome/free-solid-svg-icons';

import {useTranslations} from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const texturesData = [
  { id: 1, title: "Mobile App", description: "Application \n Development \n Mobile", path: "/textures/iPhone-14-Plus-deep-purple.jpg", icon: faSun },
  { id: 2, title: "Web App", description: "Description 2", path: "/textures/Wallpaper_baseColor.jpeg", icon: faStar },
  { id: 3, title: "UI / UX / 3D", description: "Description 3", path: "/textures/iPhone-14-Plus-deep-purple.jpg", icon: faMoon },
  { id: 4, title: "Advanced AI", description: "Description 4", path: "/textures/Wallpaper_baseColor.jpeg", icon: faTree },
];

const ButtonStyle = "bg-white bg-opacity-50 rounded-4xl p-5 m-2 cursor-pointer transition duration-200 ease-in-out transform backdrop-blur-sm border border-gray-eeeeee hover:scale-105 hover:bg-opacity-80";
function TextureButton({ texture, setActiveTexture }) {
  return (
    <div onClick={() => setActiveTexture(texture.id)} className={ButtonStyle}>
      <div className="flex items-center mb-2">
        <div className="absolute top-5 left-5 w-10 h-10 rounded-full bg-gray-444444 -z-10"></div>
        <div className="w-10 h-10 flex items-center justify-center">
          <FontAwesomeIcon icon={texture.icon} size="1x" className=" absolute mr-0 text-white  ml-0 mt-0 text-[1rem]" />
        </div>
        
        <h2 className="text-lg ml-2 font-sans text-neutral-600 font-[600]">{texture.title}</h2>
      </div>
      <p className="font-sans text-sm text-neutral-600">{texture.description}</p>
    </div>
  );
}



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
  const gltf = useLoader(GLTFLoader, "/scene.gltf");
  const { camera } = useThree();

 const texture1 = useLoader(TextureLoader, '/textures/iPhone-14-Plus-deep-purple.jpg');
const texture2 = useLoader(TextureLoader, '/textures/Wallpaper_baseColor.jpeg');

  const meshRef = useRef();
  camera.position.z = -5; 
  camera.lookAt(0, 0, 0); 

  useEffect(() => {
      const textureToApply = useLoader(TextureLoader, texturesData[activeTexture - 1].path);

      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name === 'Body_Wallpaper_0') {
          child.material.map = textureToApply;
          child.material.roughness = 2;
          child.material.needsUpdate = true;
        }
      });
    }, [activeTexture]);


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
  const t = useTranslations('Index');
  
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
<div className="flex flex-col h-full bg-gray-100 overflow-y-auto dark:bg-black">
      <div className="flex flex-col md:flex-row h-screen relative">
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center h-half md:h-full">
          <h1 className="text-2xl font-museo md:text-4xl lg:text-6xl font-bold mb-4 text-gray-444444 dark:text-white">We create applications</h1>
          <p className="text-lg mb-4 md:mb-6 lg:text-xl text-gray-600 dark:text-gray-300">High-end applications for companies that think big - your success is our priority.</p>
        </div>
        <div className="w-full md:w-1/2 h-half md:h-screen relative">
           <Canvas className="absolute top-0 left-0 w-full h-screen z-10">
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
        
        <div className="absolute bottom-4 md:bottom-20 right-4 md:right-20 flex space-x-4 md:space-x-10 z-30 overflow-x-auto">
          {texturesData.map(texture => (
            <TextureButton
              key={`text_${texture.id}`}
              texture={texture}
              setActiveTexture={setActiveTexture}
            />
          ))}
        </div>
      </div>
      

      {/* New Section: Our story */}
      <div className="flex flex-col items-center py-16 md:py-32 bg-gray-200 z-0">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Story</h2>
        <p className="text-lg md:text-xl lg:text-2xl mb-6 max-w-3xl text-center">From our humble beginnings in a garage to becoming a global leader in application development, our journey has been nothing short of spectacular. We believe in pushing the boundaries of innovation and delivering solutions that make a difference.</p>
      </div>

    </div>

  );
}
