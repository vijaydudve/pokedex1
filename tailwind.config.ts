import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        darkblue: '#2e3156',
        lightblue: '#5d5f7e',
        ice: '#c9dde2',
        shadow: '#CACACA',
        primary: '#deeded',
        secondary:'#404773',
        tertiary:'#5d5f7e',
        bordercolor: '#5a607b',
        slidertrack: '#93b2b2',
        slidercontainer: '#f1f3f3',
        pastelblue: '#b0d2d2',
        bluegray: '#93b2b2',
        fighting: '#FCC1B0',
        flying: '#B2D2E8',
        poison: '#CFB7ED',
        ground: '#F4D1A6',
        rock: '#C5AEA8',
        bug: '#C1E0C8',
        ghost: '#D7C2D7',
        steel: '#C2D4CE',
        fire: '#EDC2C4',
        water: '#CBD5ED',
        grass: '#C0D4C8',
        electric: '#E2E2A0',
        psychic: '#DDC0CF',
        dragon: '#CADCDF',
        dark: '#C6C5E3',
        fairy: '#E4C0CF',
        unknown: '#C0DFDD',
        normal: '#DDCBD0',
      },
    },
  },
  plugins: [],
};
export default config;
