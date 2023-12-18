const plugin = require('tailwindcss/plugin')

const toPX = (values) =>
  Object.fromEntries(values.map((v) => [+v, `${v}px`]))
const object0to100px = toPX(Array.from({ length: 101 }).map((_, i) => +i))

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    spacing: object0to100px,
    borderRadius: {
      ...object0to100px,
      full: '9999px'
    },

    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const typographyWithOnlySizes = {}
      for (let i = 8; i <= 100; i += 2) {
        typographyWithOnlySizes[`.text-${i}`] = { fontSize: `${i}px` }
      }

      addUtilities(typographyWithOnlySizes)
    })
  ],
}

