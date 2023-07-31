/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-eeeeee': '#EEEEEE',
        'gray-444444': '#444444',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
    fontFamily: {
      'sans': ['Exo', 'sans-serif'],
      'museo': ['Museo Sans Rounded', 'sans-serif'],
    },
    fontWeight: {
      'extraextrabold': '1000',
    },
  },
  plugins: [],
}