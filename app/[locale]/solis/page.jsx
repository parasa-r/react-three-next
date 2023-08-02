'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"; // Import useState
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshDistortMaterial, Environment,AdaptiveDpr, AdaptiveEvents  } from '@react-three/drei'
import { Suspense } from "react";
import { Clock } from 'three';
import { gsap } from "gsap";
import { faSun, faMoon, faStar, faTree } from '@fortawesome/free-solid-svg-icons';
import Curtain from "@/components/anim/Curtain";

import {useTranslations} from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const texturesData = [
  { id: 1, title: "Mobile App", mainText: "website-dev", description: "Application \n Development \n Mobile", path: "/textures/iPhone-14-Plus-deep-purple.jpg", icon: faSun },
  { id: 2, title: "Web App", mainText: "webapp-dev", description: "Description 2", path: "/textures/Wallpaper_baseColor.jpeg", icon: faStar },
  { id: 3, title: "UI / UX / 3D", mainText: "uiux3d-dev", description: "Description 3", path: "/textures/iPhone-14-Plus-deep-purple.jpg", icon: faMoon },
  { id: 4, title: "Advanced AI", mainText: "ai-dev", description: "Description 4", path: "/textures/Wallpaper_baseColor.jpeg", icon: faTree },
];
  

const ButtonStyle = "bg-white button bg-opacity-50 dark:bg-opacity-80 rounded-4xl p-5 m-2 cursor-pointer transition transition-transform  duration-200 ease-in-out transform backdrop-blur-sm border border-gray-eeeeee hover:-translate-y-4 hover:bg-opacity-80";
function TextureButton({ texture, setActiveTexture, activeTexture, setIsInteracting }) {
  let isMoovement = false;


  const handleClick = (event) => {
    event.stopPropagation();
    setActiveTexture(texture.id);
    setIsInteracting(true); 
    isMoovement = true;
  }
  
  let buttonClasses = `${ButtonStyle}`;
  if (activeTexture === texture.id) {
    buttonClasses += ' selected';
  } else if (isMoovement) {
    buttonClasses += ' deselected';
  }

  return (
    <div 
      onClick={handleClick} 
      className={buttonClasses}
    >
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

const IMacModel = ({mousePosition, modelPositionY}) => {
  const gltf = useLoader(GLTFLoader, "/imac_2021/scene.gltf");
  const meshRef = useRef(); 

   // Effet parallaxe
  useEffect(() => {
    gsap.to(meshRef.current.position, {
      x: mousePosition.x * 10,  // Ajustez ces valeurs selon l'effet souhaité
      y: mousePosition.y * 2,
      duration: 0.5,
      ease: "power2.out"
    });
  }, [mousePosition]);

  // Effet de défilement
  useEffect(() => {
    gsap.to(meshRef.current.position, {
      y: modelPositionY * 0.5, // Ajustez ce multiplicateur en fonction de vos besoins
      duration: 0.5,
      ease: "power2.out"
    });
  }, [modelPositionY]);


  return (
    <primitive ref={meshRef} object={gltf.scene} position={[0, 100, 300]} rotation={[0, Math.PI/2, 0]} scale={2} />
  );
};

const Model = ({ activeTexture, scrollValue, mousePosition, isMouseWithinFirstSection }) => {
  const gltf = useLoader(GLTFLoader, "/scene.gltf");
  const { camera } = useThree();

 const texture1 = useLoader(TextureLoader, '/textures/iPhone-14-Plus-deep-purple.jpg');
const texture2 = useLoader(TextureLoader, '/textures/Wallpaper_baseColor.jpeg');

  const meshRef = useRef();
  camera.position.x = -1; 
  camera.position.z = -5; 
  
  camera.lookAt(0, 0, 0); 

  useEffect(() => {
    if (isMouseWithinFirstSection && meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        x: mousePosition.y * 0.5,
        y: mousePosition.x * 0.5,
        duration: 0.5
      });
    }
  }, [mousePosition, isMouseWithinFirstSection]);

  useEffect(() => {
    if (!meshRef.current) return;

    const rotationValue = gsap.utils.mapRange(0, 1000, 0, Math.PI, scrollValue);
    gsap.to(meshRef.current.rotation, { y: rotationValue, duration: 0.5 });

  }, [scrollValue]);

  useEffect(() => {
    if (activeTexture === null) return;

    const textureToApply = useLoader(TextureLoader, texturesData[activeTexture - 1].path);

    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name === 'Body_Wallpaper_0') {
        child.material.map = textureToApply;
        child.material.roughness = 2;
        child.material.needsUpdate = true;
      }
    });
  }, [activeTexture]);

  return (
    <>
      <primitive ref={meshRef} object={gltf.scene} position={[-3, 0, 0]} scale={4} />

    </>
  );
};

export default function App() {
  const t = useTranslations('Home');
  
  const [activeTexture, setActiveTexture] = useState(1); // 1 for texture1 and 2 for texture2
  const [scrollValue, setScrollValue] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const buttonGroupRef = useRef(null);
  const [modelPositionY, setModelPositionY] = useState(0);
    const sectionRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseWithinFirstSection, setMouseWithinFirstSection] = useState(false);



  const ref = useRef()
  const activeTextureData = texturesData.find(texture => texture.id === activeTexture);

  useEffect(() => {
    if (isInteracting) return; // stop the carousel if the user has interacted

    const intervalId = setInterval(() => {
      setActiveTexture(prevTexture => prevTexture % texturesData.length + 1);
    }, 4000);

    return () => clearInterval(intervalId); // cleanup on unmount or when dependencies change
  }, [isInteracting]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      
      if (scrollValue === 0) {
        setMouseWithinFirstSection(true);

        const xRatio = (e.clientX / window.innerWidth) - 0.5;
        const yRatio = (e.clientY / window.innerHeight) - 0.5;
        setMousePosition({ x: xRatio, y: yRatio });
      } else {
        setMouseWithinFirstSection(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scrollValue]);

  const selectedTitle = useMemo(() => {
    const texture = texturesData.find(t => t.id === activeTexture);
    return texture ? texture.title : '';
  }, [activeTexture]);

  useEffect(() => {
    const currentRef = ref.current;
    const handleScroll = () => {
      if (currentRef) {
        let scrollY = currentRef.scrollTop;
        let height = currentRef.scrollHeight - currentRef.clientHeight;
        let scrolled = height > 0 ? scrollY / height : 0;

        setOpacity(1 - scrolled); // cela réduit l'opacité à mesure que vous défilez vers le bas
        setScrollValue(currentRef.scrollTop);
      }
    };

    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    if (sectionRef.current) {
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const sectionBottom = sectionRef.current.getBoundingClientRect().bottom;

      if (sectionTop <= 0 && sectionBottom >= 0) {
        // Si nous sommes dans la première section
        setModelPositionY(-sectionTop); // La valeur de déplacement est la distance du haut de la section à la vue du navigateur
      }
    }


    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

 

  return (
    <div ref={ref} className="flex flex-col h-screen bg-gray-100 overflow-y-auto dark:bg-black">
      <Canvas 
    camera={{ fov: 80 }} 
    style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      zIndex: 20,
      backgroundColor: 'transparent',
      transition: 'all 0.3s ease',
      pointerEvents: 'none'
    }}
  >
    <ambientLight intensity={1.25} />
    <directionalLight intensity={0.4} />
    <Suspense fallback={null}>
      {/*<Sun scrollValue={scrollValue} />*/}
      
      <Model activeTexture={activeTexture} scrollValue={scrollValue} mousePosition={mousePosition} isMouseWithinFirstSection={isMouseWithinFirstSection} />
      <IMacModel mousePosition={mousePosition} scrollValue={scrollValue} modelPositionY={modelPositionY}/>
    </Suspense>
    <Environment preset="night" />
    <AdaptiveDpr pixelated />
    <AdaptiveEvents />
    {/* <OrbitControls /> */}
  </Canvas>

  

      <div className="flex flex-col md:flex-row h-screen relative" ref={sectionRef}>
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center h-half md:h-full">
          <h1 className="text-2xl lg:leading-[7.3rem] font-[600] font-museo md:text-4xl lg:text-9xl font-bold mb-4 text-gray-444444 dark:text-white">{activeTextureData ? t(activeTextureData.mainText) : <></>}</h1>
          <p className="text-lg mb-4 md:mb-6 lg:text-xl text-gray-600 dark:text-gray-300">High-end applications for companies that think big - your success is our priority.</p>
        </div>
        <div className="w-full md:w-1/2 h-half md:h-screen relative">
          
           </div>
        
        <div ref={buttonGroupRef} style={{ opacity: opacity }} className="absolute bottom-4 pt-4 md:bottom-20 right-4 md:right-20 flex space-x-4 md:space-x-10 z-30 overflow-x-auto">
          {texturesData.map(texture => (
            <TextureButton
              key={`text_${texture.id}`}
              texture={texture}
              setActiveTexture={setActiveTexture}
              activeTexture={activeTexture}
              setIsInteracting={setIsInteracting} 
            />
          ))}
        </div>
      </div>
      

      {/* New Section: Our story */}
      <div className="flex flex-col items-center py-16 md:py-32 bg-gray-200 z-0">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Story</h2>
        <p className="text-lg md:text-xl lg:text-2xl mb-6 max-w-3xl text-center">From our humble beginnings...</p>
      </div>

    </div>

  );
}
