import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        ink: '#1d2a24',
        moss: '#2f6f4e',
        leaf: '#5f8f4f',
        river: '#3b82a0',
        clay: '#b4532f',
        mist: '#f3f7f1'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(29, 42, 36, 0.12)'
      }
    }
  }
} satisfies Config
