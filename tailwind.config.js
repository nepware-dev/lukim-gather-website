module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'color-blue': '#0D4979',
      'color-text': '#282F3E',
      'color-lt-grey': '#9FA3A9',
      'color-black': '#000000',
      'color-white': '#FFFFFF',
      'color-bg': '#F2F5F9',
      'color-border': '#CFD5DC',
    },
  },
  plugins: [],
};
