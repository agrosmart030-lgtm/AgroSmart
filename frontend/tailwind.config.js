/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {      fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
    },},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], // garante que um tema esteja ativo
  },
};
