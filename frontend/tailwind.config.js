/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fdfbf7",
        pencil: "#2d2d2d",
        oldpaper: "#e5e0d8",
        markerRed: "#ff4d4d",
        penBlue: "#2d5da1",
        postit: "#fff9c4",
      },
      fontFamily: {
        heading: ['"Kalam"', 'cursive', 'sans-serif'],
        body: ['"Patrick Hand"', 'cursive', 'sans-serif'],
        mono: ['"Patrick Hand"', 'monospace'],
      },
      borderRadius: {
        'wobbly': '255px 15px 225px 15px / 15px 225px 15px 255px',
        'wobbly-md': '15px 225px 15px 255px / 255px 15px 225px 15px',
        'wobbly-sm': '120px 10px 100px 10px / 10px 100px 10px 120px',
        'wobbly-btn': '180px 20px 190px 20px / 20px 190px 20px 180px',
        'wobbly-badge': '255px 25px 225px 25px / 25px 225px 25px 255px',
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #2d2d2d',
        'hard-sm': '2px 2px 0px 0px #2d2d2d',
        'hard-md': '3px 3px 0px 0px #2d2d2d',
        'hard-lg': '8px 8px 0px 0px #2d2d2d',
        'hard-red': '4px 4px 0px 0px #ff4d4d',
        'hard-blue': '4px 4px 0px 0px #2d5da1',
        'hard-subtle': '3px 3px 0px 0px rgba(45, 45, 45, 0.15)',
      },
      animation: {
        'jiggle': 'jiggle 0.4s ease-in-out infinite alternate',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
      },
      keyframes: {
        jiggle: {
          '0%': { transform: 'rotate(-1.5deg)' },
          '100%': { transform: 'rotate(1.5deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
