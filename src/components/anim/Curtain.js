import React, { useEffect, useState } from 'react';
import { gsap } from "gsap";
import LogoSolis from '../../../public/assets/logo-solis.svg'
import LogoSolisDark from '../../../public/assets/logo-solis-dark.svg'
import Image from 'next/image';
import {useTranslations} from 'next-intl';

const Curtain = ({ darkMode }) => {
  const t = useTranslations('Home');
  const [loaded, setLoaded] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);

  useEffect(() => {
    // Check session storage here and set showCurtain accordingly
    if (typeof window !== 'undefined' && !window.sessionStorage.getItem('curtainShown')) {
      setShowCurtain(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded && showCurtain) {
      gsap.to('.curtain', { y: '-100%', delay: 1.5, duration: 1.5, ease: "power2.out" });
      setLoaded(true);

      // Set session storage item here after curtain has been shown
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('curtainShown', 'true');
      }
    }
  }, [loaded, showCurtain]);

  return showCurtain ? (
    <div className="curtain w-full h-screen absolute top-0 left-0 bg-white dark:bg-black flex flex-col items-center justify-center text-3xl font-bold z-50">
        {darkMode ? 
            <Image
              priority
              src={LogoSolisDark} // utilisation du logo sombre en mode sombre
              alt="Logo Solis Dark"
              className='h-24 w-72 mb-5'
            /> : 
            <Image
              priority
              src={LogoSolis} // utilisation du logo clair en mode clair
              alt="Logo Solis"
              className='h-24 w-72 mb-5'
            />
        }
        <div className='text-2xl md:text-4xl lg:text-7xl dark:text-white'>
            {t('title')}
        </div>
    </div>
  ) : null;
}

export default Curtain;
