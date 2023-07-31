'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LogoSolis from '../../../public/assets/logo-solis.svg'
import LogoSolisDark from '../../../public/assets/logo-solis-dark.svg'
import DarkModeToggle from '../buttons/DarkModeToggle'
import Image from 'next/image';
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

const Layout = ({ children }) => {
  const ref = useRef()
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = window.localStorage.getItem('theme');
    if (theme) {
      if (theme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(dark-mode: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');

    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      window.localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      window.localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  return (
     <div
      ref={ref}
      className="relative overflow-auto touch-action-none"
    >
      <header className="flex justify-between items-center py-4 px-8 bg-gray-100 dark:bg-black">
        <div className="flex items-center">
          {darkMode ? 
            <Image
              priority
              src={LogoSolisDark} // utilisation du logo sombre en mode sombre
              alt="Logo Solis Dark"
              className='h-12 w-12 w-36'
            /> : 
            <Image
              priority
              src={LogoSolis} // utilisation du logo clair en mode clair
              alt="Logo Solis"
              className='h-12 w-36'
            />
          }
          <div className='text-black dark:text-white ml-4'>
            menu1 menu2 menu3
          </div>
        </div>
        <div className="flex items-center">
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </header>

      {children}

      <Scene
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        eventSource={ref}
        eventPrefix='client'
      />
    </div>
  )
}

export { Layout }
