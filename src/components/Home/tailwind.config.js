/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        mid: '#06923E',
        primary: '#E67514',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
