'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LogoSolis from '../../../public/assets/logo-solis.svg'
import LogoSolisDark from '../../../public/assets/logo-solis-dark.svg'
import DarkModeToggle from '../buttons/DarkModeToggle'
import Image from 'next/image';
import Curtain from '../anim/Curtain'
import LocaleSwitcher from '../LocaleSwitcher'

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
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
      <Curtain darkMode={darkMode}/>
      <header className="flex justify-between items-center py-4 px-8 -z-10 ">
        <div className="flex flex-row items-center">
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
        </div>

        <div className='text-black dark:text-white ml-4 grow'>
          menu1 menu2 menu3
        </div>
        <LocaleSwitcher />
        <div className="flex items-center">
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </header>

      {children}

      {/*<footer className={" bg-slate-300 flex h-96"}>
        <div>
          <h2>Let's Talk</h2>
          <h3>Send the email</h3>
          <div>
            <div className="relative mt-2">
              <input
                type="text"
                name="name"
                id="name"
                className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Name"
              />
              <div
                className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div>

        </div>
        </footer>*/}

      <Scene
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        eventSource={ref}
        eventPrefix='client'
      />
    </div>
  )
}

export { Layout }
