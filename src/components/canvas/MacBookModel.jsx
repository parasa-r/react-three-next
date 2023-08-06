import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { gsap } from 'gsap';
import * as THREE from 'three';

export const MacBookModel = ({ activeTexture, mousePosition, scrollValue, isMouseWithinFirstSection, texturesData }) => {
  const gltf = useLoader(GLTFLoader, "/apple_mac_studio_system_2023/scene4.gltf");
  const meshRef = useRef();

  const texture = useLoader(TextureLoader, '/textures/goutt.png');
  texture.anisotropy = 16;
  texture.needsUpdate = true;

  const initialPosition = { x: -2.2, y: -0.9, z: -2 };

  const initialRotation = { x: -0.2, y: 3.3, z: -0.06 };  // Define the initial rotation values

  useFrame(() => {
    // Frame update logic here if needed
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.x = initialPosition.x;
      meshRef.current.position.y = initialPosition.y;
      meshRef.current.position.z = initialPosition.z;
    }
  }, []);

  useEffect(() => {
    if (isMouseWithinFirstSection && meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        x: initialRotation.x + mousePosition.y * -0.05,
        y: initialRotation.y + mousePosition.x * 0.05,
        duration: 0.5
      });
    }
    console.log("hallo ", mousePosition)
  }, [mousePosition, isMouseWithinFirstSection]);

  useEffect(() => {
    if (activeTexture === null) return;

    const textureToApply = texturesData[activeTexture - 1].macPath;
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name === 'screen') {
        child.material.color.set(0xffffff);
        child.material.map = new TextureLoader().load(textureToApply);
        child.material.roughness = 2;
        child.material.emissive = new THREE.Color(1, 1, 1); // La couleur émissive est blanche
        child.material.emissiveIntensity = 0; // L'intensité est maximale
        child.material.needsUpdate = true;
      }
    });
  }, [activeTexture, texturesData]);

  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name === 'screen') {
        child.material.color.set(0xffffff);
        child.material.map = texture;
        child.material.roughness = 2;
        //child.material.metalness = 0;
        child.material.emissive = new THREE.Color(1, 1, 1); // La couleur émissive est blanche
        child.material.emissiveIntensity = 0; // L'intensité est maximale
        child.material.needsUpdate = true;
      }
    });
  }, [gltf, texture]);

  useEffect(() => {
    const scrollThreshold = 50;
    if (scrollValue && meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        z: initialRotation.z,
        duration: 0.5
      });

      gsap.to(meshRef.current.position, {
        y: initialPosition.y + scrollValue * 0.005,
        duration: 0.5,
        ease: "power1.out", // you can change the easing for different types of animation
      });
    }
  }, [scrollValue]);

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={[400, -350, -2]}
      rotation={[initialRotation.x, initialRotation.y, initialRotation.z]}
      scale={5}
    />
  );
};
