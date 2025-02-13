/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      flex: {
        '4': '4 4 0%'
      },
      colors: {
        'cl1': '#2e374a',
        'cl2': '#5d57c9',
        'cl3': '#b7bac1',
        'cl4': '#7198C4',
        'cl5': '#E2E8F0'
      },
      textColor: {
        'soft': 'var(--textSoft)',
        'text': '#fff'
      },
    },

  },
  plugins: [],
}
