'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"; // Import useState
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshDistortMaterial, Environment,AdaptiveDpr, AdaptiveEvents  } from '@react-three/drei'
import { Suspense } from "react";
import { Clock } from 'three';
import { gsap } from "gsap";
import { faSun, faMoon, faStar, faTree, faMobileScreen, faWindowMaximize, faRobot, faPaintBrush, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Curtain from "@/components/anim/Curtain";
import Image from 'next/image';
import mac from '../../../public/assets/pngegg.png'
import * as THREE from 'three';

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import PersonPictureButton from "@/components/buttons/PersonPictureButton";

import {useTranslations} from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const texturesData = [
  { id: 1, path: "/textures/iPhone-14-Plus-deep-purple.jpg", macPath : "/textures/goutt.png"},
  { id: 2, path: "/textures/Wallpaper_baseColor.jpeg", macPath : "/textures/Wallpaper_baseColor.jpeg"},
  { id: 3, path: "/textures/Wallpaper_baseColor.jpeg", macPath : "/textures/iPhone-14-Plus-deep-purple.jpg"},
  { id: 4, path: "/textures/iPhone-14-Plus-deep-purple.jpg", macPath : "/textures/goutt.png"},
  { id: 5, path: "/textures/Wallpaper_baseColor.jpeg", macPath : "/textures/goutt.png"},
  { id: 6, path: "/textures/aurelien2.jpg", macPath : "/textures/goutt.png"},
  { id: 7, path: "/textures/aymeric2.png", macPath : "/textures/goutt.png"},
  { id: 8, path: "/textures/romain.png", macPath : "/textures/goutt.png"},
  { id: 9, path: "/textures/ozam4.png", macPath : "/textures/ozam2.png"},
];

const services = [
  { id: 1, title: "Mobile App", texture : 1 , mainText: "mobileApp-dev", description: "mobileApp-dev-text", icon: faMobileScreen },
  { id: 2, title: "Web App", texture : 2 , mainText: "webapp-dev", description: "Description 2", icon: faWindowMaximize },
  { id: 3, title: "Website", texture : 3 , mainText: "webapp-dev", description: "Description 2", icon: faGlobe },
  { id: 4, title: "UI / UX / 3D", texture : 4 , mainText: "uiux3d-dev", description: "Description 3", icon: faPaintBrush },
  { id: 5, title: "Advanced AI", texture : 5 , mainText: "ai-dev", description: "Description 4", icon: faRobot },
];

const people = [
  { id: 1, title: "Chief Marketing Officier", texture : 6 , name: "Aurélien Santi"},
  { id: 2, title: "Chief Technology Officier", texture : 7 , name: "Aymeric Sarrasin"},
  { id: 3, title: "Chief Executive Officier", texture : 8 , name: "Romain Darioli"},
];


  /*const activeTexturesData = services.map(service => ({
  id: service.texture,
  path: texturesData.find(texture => texture.id === service.texture).path
}));*/
  

const ButtonStyle = "bg-white  button bg-opacity-50 dark:bg-opacity-80 rounded-4xl p-5 m-2 mb-10 cursor-pointer transition transition-transform  duration-200 ease-in-out transform backdrop-blur-sm border border-gray-eeeeee dark:border-gray-444444 hover:-translate-y-4 hover:bg-opacity-80";


function TextureButton({ texture, setActiveTexture, activeTexture, setIsInteracting, section, setSelectedService }) {
  const isServiceButton = section === 'services';
  let isMoovement = false;

  let isActive = false;


  const handleClick = (event) => {
    event.stopPropagation();
    setActiveTexture(texture.id);
    setIsInteracting(true);
    setSelectedService(texture);
    isMoovement = true;
  }
  
  let buttonClasses = `${ButtonStyle}`;
  if (activeTexture === texture.id) {
    buttonClasses += ' selected';
    isActive = true;
  } else if (isMoovement) {
    buttonClasses += ' deselected';
    isActive = false;
  }

  return (
    <div 
      onClick={handleClick} 
      className={buttonClasses}
    >
      <div className="flex items-center">
        <div className={`absolute top-5 left-5 w-10 h-10 rounded-full  -z-10 ${isActive ? ' bg-white ' : ' bg-fuchsia-600  '}`}></div>
        <div className="w-10 h-10 flex items-center justify-center">
          <FontAwesomeIcon icon={texture.icon} size="1x" className={`absolute mr-0  ml-0 mt-0 text-[1rem] ${isActive ? ' text-fuchsia-600 ' : ' text-white'}`}/>
        </div>
        
        <h2 className={`text-lg ml-2 font-sans  font-[600] ${isActive ? ' text-white ' : ' text-neutral-600 '}`}>{texture.title}</h2>
      </div>
      {/*<p className="font-sans text-sm text-neutral-600">{texture.description}</p>*/}
    </div>
  );
}

import { TextureLoader} from "three";



import {MacBookModel}  from "../../../src/components/canvas/MacBookModel"

import { IphoneModel } from "@/components/canvas/IphoneModel";












//__________________


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
  const [selectedService, setSelectedService] = useState(services[0]);

  const [activePersonTexture, setActivePersonTexture] = useState(1);

  


  const section1Ref = useRef(null);
  const [isInSection1, setIsInSection1] = useState(false);

  const section2Ref = useRef(null);
  const [isInSection2, setIsInSection2] = useState(false);

  const section3Ref = useRef(null);
  const [isInSection3, setIsInSection3] = useState(false);

  const texture1 = useLoader(TextureLoader, texturesData[0].path);
  const texture2 = useLoader(TextureLoader, texturesData[1].path);
  const texture3 = useLoader(TextureLoader, texturesData[2].path);
  const texture4 = useLoader(TextureLoader, texturesData[3].path);
  const texture5 = useLoader(TextureLoader, texturesData[4].path);
  const texture6 = useLoader(TextureLoader, texturesData[5].path);
  const texture7 = useLoader(TextureLoader, texturesData[6].path);
  const texture8 = useLoader(TextureLoader, texturesData[7].path);


  const lightRef = useRef();


  const yellowCircleRef = useRef();
  const bgCircle2Ref = useRef();


    const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

  useEffect(() => {
    if (isInteracting) return; // stop the carousel if the user has interacted

    const intervalId = setInterval(() => {
      if(isInSection1) {
        setActiveTexture(prevTexture => prevTexture % texturesData.length + 1);
      }
    }, 4000);

    return () => clearInterval(intervalId); // cleanup on unmount or when dependencies change
  }, [isInteracting]);
  

  /*useEffect(() => {
    gsap.to(yellowCircleRef.current, {
        x: '50px',  // déplacement en x
        y: '50px',  // déplacement en y
        repeat: -1, // boucle infinie
        yoyo: true, // revient à la position initiale avant de recommencer
        duration: 2, // durée de l'animation
        ease: 'power1.inOut' // effet d'accélération et de décélération pour un mouvement plus naturel
    });
}, []);*/

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // 0.5 means when at least 50% of the section is visible
    };

    const observer1 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInSection1(entry.isIntersecting);
      });
    }, options);

    const observer2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInSection2(entry.isIntersecting);
      });
    }, options);

    const observer3 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInSection3(entry.isIntersecting);
      });
    }, options);

    if (sectionRef.current) {
      observer1.observe(sectionRef.current);
    }

    if (section2Ref.current) {
      observer2.observe(section2Ref.current);
    }

    if (section3Ref.current) {
      observer3.observe(section3Ref.current);
    }

    return () => {
      if (section1Ref.current) {
        observer1.unobserve(section1Ref.current);
      }
      if (section2Ref.current) {
        observer2.unobserve(section2Ref.current);
      }
      if (section3Ref.current) {
        observer3.unobserve(section3Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(-4, 0, -0.95);
      lightRef.current.target.updateMatrixWorld();
    }
  }, []);


  useEffect(() => {
    const currentRef = ref.current;
    const handleScroll = () => {
      if (currentRef) {
        let scrollY = currentRef.scrollTop;
        let height = currentRef.scrollHeight - currentRef.clientHeight;
        let scrolled = height > 0 ? scrollY / height : 0;

        setOpacity(1 - scrolled); // cela réduit l'opacité à mesure que vous défilez vers le bas
        setScrollValue(scrollY);

        // Animate the yellow circle's position and/or rotation based on scroll value
        gsap.to(yellowCircleRef.current, {
          x: `${scrollY * 0.1}px`,
          y: `${-scrollY * 0.4}px`, // change 0.5 to control the speed of parallax
          //rotation: `${scrollY * 0.02}deg`, // change 0.02 to control the speed of rotation, uncomment this if you want to rotate the div and have the necessary wrapper or plugin
          duration: 0.5,
          ease: 'linear',
        });

        gsap.to(bgCircle2Ref.current, {
          x: `${scrollY * -0.6}px`,
          y: `${-scrollY * 0.3}px`, // change 0.5 to control the speed of parallax
          //rotation: `${scrollY * 0.02}deg`, // change 0.02 to control the speed of rotation, uncomment this if you want to rotate the div and have the necessary wrapper or plugin
          duration: 0.5,
          ease: 'linear',
        });
      }
    };
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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
    <div ref={ref} className="flex flex-col h-screen overflow-y-auto ">
    <div ref={yellowCircleRef} className="fixed w-[500px] h-[500px] blur-xl bg-neutral-300 dark:bg-[#292929] rounded-[999999px] -z-10 top-[140px] -left-[300px]"></div>
    <div ref={bgCircle2Ref} className="fixed w-[500px] h-[500px] blur-xl bg-fuchsia-100 dark:bg-[#1e0320] rounded-[999999px] -z-10 top-[840px] -right-[300px]"></div>
    <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#c026d3",
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 5,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />

          
      {activeTexture === 2 ? 
        <></>
        :<></>
      }
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas
        camera={{ fov: 14 }} 
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          zIndex: 10,
          backgroundColor: 'transparent',
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        <ambientLight intensity={0.25}  position={[-4, 0, 1]} />
        <directionalLight intensity={0.4}  position={[-4, 0, 1]} />
        <directionalLight intensity={2.5}  position={[-4, 0, -1]}   ref={lightRef}/>
        <Suspense fallback={null}>
          {/*<Sun scrollValue={scrollValue} />*/}
          <MacBookModel activeTexture={activeTexture} texturesData={texturesData} scrollValue={scrollValue} mousePosition={mousePosition} isMouseWithinFirstSection={isMouseWithinFirstSection} />
          <IphoneModel activeTexture={activeTexture} texturesData={texturesData} isInSection1={isInSection1} isInSection2={isInSection2} isInSection3={isInSection3}  setActiveTexture={setActiveTexture} scrollValue={scrollValue} mousePosition={mousePosition} isMouseWithinFirstSection={isMouseWithinFirstSection}/>
        </Suspense>
        <Environment preset="night" />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        {/* <OrbitControls /> */}
      </Canvas>
    </Suspense>
      <div className="flex flex-col md:flex-row h-screen relative mb-[500px] -mt-20" ref={sectionRef}>
        
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center h-half md:h-full">
          <h1 ref={section1Ref} className="text-2xl lg:leading-[6rem] font-[600] font-museo md:text-4xl lg:text-8xl font-bold mb-4 text-gray-444444 dark:text-white">{selectedService ? t(selectedService.mainText) : <></>}</h1>
          <p className="text-lg mb-4 md:mb-6 lg:text-xl text-gray-600 dark:text-gray-300">{selectedService ? t(selectedService.description) : <></>}</p>
        
          <div  className="text-xl mb-4 md:mb-6 lg:text-2xl font-[600] text-gray-600 dark:text-gray-300">
            {t("technology")}
          </div>
        </div>
        <div className="w-full md:w-1/2 h-half md:h-screen relative">       
        </div>
        <div ref={buttonGroupRef} style={{ opacity: opacity }} className="absolute bottom-4 pt-4  right-4 md:right-20 flex space-x-4 md:space-x-10 z-30 overflow-x-auto">
          {services.map(service => (
            <TextureButton
              key={`text_${service.id}`}
              texture={service}
              setActiveTexture={setActiveTexture}
              activeTexture={activeTexture}
              setIsInteracting={setIsInteracting}
              section="services"
              setSelectedService={setSelectedService}
            />
          ))}
        </div>
      </div>

      {/* New Section: Our story */}
      <div className="flex md:h-full mb-[300px]">
        <div className="p-4 md:p-8 basis-1/2  flex flex-col justify-center h-half md:h-full mb-[300px]">
          <h2 className="text-2xl lg:leading-[6rem] font-[600] font-museo md:text-4xl lg:text-8xl font-bold mb-4 text-gray-444444 dark:text-white">Our Story</h2>
          <p className="text-lg mb-4 md:mb-6 lg:text-xl text-gray-600 dark:text-gray-300">Aurélien and Aymeric, passionate about technology met while studying computer science in Switzerland and quickly started collaborating on innovative personal projects. Observing the market dominated by standardized solutions, they created their own high-end IT development company offering customized services to meet the specific needs of each client. Their company uses the most advanced technologies to deliver innovative custom solutions to companies seeking to address complex challenges.</p>
        </div>
        <div className="p-4 md:p-8 pt-48 md:pt-48 basis-1/2 mjustify-center ">
          <div className="flex flex-row bg-neutral-600 rounded-5xl">
            <div className="p-4 md:p-8 flex basis-1/2 flex-col  justify-center  ">

            <h2 className="text-2xl lg:leading-[6rem] font-[600] font-museo md:text-4xl lg:text-5xl font-bold mb-4 text-white dark:text-gray-444444">
              Direction
            </h2>

            {people.map(person => (
              <PersonPictureButton
                key={`person_${person.id}`}
                person={person}
                texture={"person"}
                setActiveTexture={setActiveTexture}
                activeTexture={activeTexture}
                isActive={activePersonTexture === person.id}
                setActive={setActivePersonTexture}
              />
            ))}

            <div ref={section2Ref} className="text-xl mt-16 text-center p-3 bg-white button bg-opacity-50 dark:bg-opacity-80  cursor-pointer rounded-full font-[600] font-museo md:text-base lg:text-xl font-bold mb-4 text-gray-444444 dark:text-white transition transition-transform  duration-200 ease-in-out transform backdrop-blur-sm border border-gray-eeeeee hover:-translate-y-4 hover:bg-opacity-80">
              Team price
            </div>

          </div>
          </div>
          
        </div>
      </div>

      <div ref={section3Ref}>
        <div className="p-4 md:p-8 flex flex-col justify-center h-half md:h-full mb-[300px]">
          <h2 className="text-2xl lg:leading-[6rem] font-[600] font-museo md:text-4xl lg:text-8xl font-bold mb-4 text-gray-444444 dark:text-white">
            
            </h2>
          </div>

      </div>


      
    </div>
  );
}
