import type { Config } from 'tailwindcss'
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/**/*.{ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        kvant: ['var(--font-kvant)'],
        typeType: ['var(--font-typeType)'],
        fobble: ['var(--font-fobble)'],
      },
      colors: {
        'sky-blue': '#80abff;',
        'oxford-blue': '#00142d',
      },
      fontSize: {
        '4xl': '2.441rem',
        '5xl': '5.052rem',
      },
    },
  },
  plugins: []
})
