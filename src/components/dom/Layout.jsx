'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import logoSolis from '../../../public/assets/logo-solis.svg'
import DarkModeToggle from '../buttons/DarkModeToggle'
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
      className="relative w-full h-full overflow-auto touch-action-none"
    >
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <logoSolis />
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
