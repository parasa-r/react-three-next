import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, TextureLoader, DirectionalLight } from 'three';

import { gsap } from 'gsap';
import * as THREE from 'three';

export const IphoneModel = ({ activeTexture, scrollValue, mousePosition, isMouseWithinFirstSection, isInSection1, isInSection2, isInSection3, texturesData, setActiveTexture }) => {
  const gltf = useLoader(GLTFLoader, "/iphone3.gltf");
  const { camera } = useThree();
  const textureToApply = useLoader(TextureLoader, texturesData.find(texture => texture.id === activeTexture).path);

  useEffect(() => {
    // Apply rotation only when isInSection2 is true
    

    
  }, [isInSection2]);

  // bug si on enlève WTF ?

  const initialPosition = { x: -0.70, y: -0.07, z: -3 };

  // Define the initial rotation values
  const meshRef = useRef();
  camera.position.x = -1;
  camera.position.z = -5;
  
  camera.lookAt(0, 0, 0); 


  useEffect(() => {
    if ( meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        x: mousePosition.y * -0.15,
        y: mousePosition.x * 0.55,
        duration: 0.5
      });
    }
  }, [mousePosition]);

  useFrame(() => {
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.x = initialPosition.x;
      meshRef.current.position.y = initialPosition.y;
      meshRef.current.position.z = initialPosition.z;
    }
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const rotationValue = gsap.utils.mapRange(0, 1000, 0, Math.PI, scrollValue);
    

    if(!isInSection2 && !isInSection3 ) {
      gsap.to(
        meshRef.current.rotation, { 
          y: rotationValue, 
          z: 0,
          duration: 0.5 
        }
      );
      gsap.to(meshRef.current.position, {
        z: Math.max(initialPosition.z + scrollValue * -0.01, -4), // stop zoom at -4
        y: Math.min(initialPosition.y + scrollValue * 0.0001, 0.00),
        x: Math.max(initialPosition.x + scrollValue * -0.003, -0.95),
        duration: 0.5,
        ease: "power1.out",
      });

    } else if (isInSection2) {
      // Apply the rotation logic here
      // ...
      if(activeTexture <=5 ){
        setActiveTexture(6)
      }

      if ( meshRef.current) {
        gsap.to(meshRef.current.rotation, {
          y: 6.5,
          z: 0,
          duration: 1
        });
      }

      gsap.to(meshRef.current.position, {
        z: Math.max(initialPosition.z + scrollValue * -0.01, -4),
        y: Math.min(initialPosition.y + scrollValue * 0.0001, 0.00),
        x: Math.max(initialPosition.x + scrollValue * -0.003, -0.95),
        duration: 0.5,
        ease: "power1.out",
      });

    } else if(isInSection3){
      gsap.to(
        meshRef.current.rotation, {
          y: 6.5,
          z: 1.57,
          duration: 1
        }
      );

      if(activeTexture <=8 ){
        setActiveTexture(9)
      }

      gsap.to(meshRef.current.position, {
        z: Math.max(initialPosition.z + scrollValue * -0.001, -4.5), // stop zoom at -4
        y: Math.min(Math.max(initialPosition.y + scrollValue * 0.0001, 0.00), 0.00),
        x: Math.min(Math.max(initialPosition.x + scrollValue * 0.003, -0.95), -0.90),
        duration: 1.5,
        ease: "power1.out",
      });

    }


    

    console.log("iphoneposition x: ", Math.max(initialPosition.z + scrollValue * -0.01, -4));

    console.log("iphoneposition y: ", Math.min(initialPosition.y + scrollValue * 0.0001, 0.00));

    console.log("iphoneposition z: ", Math.max(initialPosition.x + scrollValue * -0.003, -0.95));


  }, [scrollValue]);


  useEffect(() => {
    if (activeTexture !== null) {



      gltf.scene.traverse((child) => {
        
        if (child.isMesh && child.name === 'Body_Wallpaper_0') {
          child.material.map = textureToApply;
          child.material.metalness = 0.540;
          child.material.map.encoding = THREE.sRGBEncoding;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [activeTexture]);

  return (
    <>
      <primitive ref={meshRef} object={gltf.scene} position={[-4, -0.4, 0]} scale={0.16} />
    </>
  );
};