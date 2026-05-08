import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        ink: '#173b2f',
        moss: '#16a34a',
        leaf: '#84cc16',
        river: '#0ea5e9',
        clay: '#f97316',
        mist: '#eefbff',
        sky: '#38bdf8',
        cloud: '#f8fdff',
        grass: '#22c55e',
        flower: '#fb7185',
        sun: '#facc15',
        sand: '#fff7ad'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(14, 165, 233, 0.16)',
        sticker: '0 8px 0 rgba(23, 59, 47, 0.08), 0 18px 35px rgba(23, 59, 47, 0.12)'
      }
    }
  }
} satisfies Config
