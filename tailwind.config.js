/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#202244',
        secondary: '#545454',
        light: {
          100: '#d6c6ff',
          200: '#a8b6db',
          300: '#9ca4ab',
        },
        dark: {
          100: '#221f3d',
          200: '#0f0d23',
        },
        accent: '#ab8bff',
        red: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontSize: {
        '2xs': '7px',
        '5xl': '3rem',   // 48px
        '6xl': '3.75rem',// 60px
        '7xl': '4.5rem', // 72px
        '8xl': '6rem',   // 96px
        '9xl': '8rem',   // 128px
        '10xl': '9rem',  // 144px
      },
      fontFamily: {
        
        'kulitan': ['kulitan'],
        'segoe-ui': ['segoe-ui'],
        'segoe-ui-italic': ['segoe-ui-italic'],
        'segoe-ui-bolditalic': ['segoe-ui-bolditalic'],
        'spacemono': ['spacemono'],
      },
    },
  },
  plugins: [],
}
