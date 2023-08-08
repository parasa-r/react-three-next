import React, { useEffect, useState } from "react";
import '../../../src/styles/DarkModeToggle.css'
import { useLoader } from "@react-three/fiber"; // Add this import
import { TextureLoader } from "three";

function PersonPictureButton({ person, texture, setActiveTexture, activeTexture, isActive, setActive }) {

  console.log("is active : ", isActive)

  const handleClick = () => {
    setActiveTexture(person.texture);
    setActive(person.id);
  };

  const ButtonStyle = "relative cursor-pointer mb-4 text-xl  font-[600] font-museo md:text-2xl lg:text-4xl font-bold mb-4 text-white dark:text-gray-444444 dark:text-white" ;

  return (
		<div onClick={handleClick} className={`${ButtonStyle} ${isActive ? ' text-fuchsia-600' : '  '}`}>
			<h3>{person.name}</h3>
			<p className=" text-base mb-3">{person.title}</p>
      <div className={`${isActive ? '  h-0 bg-white w-full pt-[0.3px] leading-none relative left-20' : ''}`}> </div>
		</div>
	);
};

export default PersonPictureButton;
