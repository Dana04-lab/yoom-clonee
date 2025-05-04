import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./node_modules/sonner/**/*.js"
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      backgroundImage: {
        hero: "url('/images/hero-background.png')",
      },
      colors: {
        dark: {
          '1': '#1C1F2E',
          '2': '#161925',
          '3': '#252A41',
          '4': '#1E2757',
        },
        blue: {
          '1': '#0E78F9',
        },
      },
    },
  },
  plugins: [],
};

export default config;
