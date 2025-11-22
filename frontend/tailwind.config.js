/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 Activa el modo oscuro mediante una clase
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // asegúrate de incluir tus componentes aquí
  ],
  theme: {
    extend: {
      colors: {
      
        primary: {
          light: '#6366F1',
          dark: '#4F46E5',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
};
