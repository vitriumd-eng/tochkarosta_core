/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#FFF5F0',
          100: '#FFE6DB',
          150: '#FFD9CA',
          200: '#FFCCB8',
          300: '#FFB394',
          400: '#FF9971',
          500: '#FF804D',
          600: '#FF6629',
          700: '#FF4D00',
          800: '#DB4200',
          900: '#B73600',
        },
        luxury: {
          cream: '#FAF8F5',
          beige: '#E8DFD5',
          sand: '#D4C4B0',
          gold: '#B8966F',
          bronze: '#9B7E5A',
          brown: '#6B5847',
          charcoal: '#3A3632',
          black: '#1A1816',
        },
        accent: {
          rose: '#E8C4BE',
          sage: '#C5D4C3',
          powder: '#D4C8D4',
        },
        colorful: {
          primary: '#FF6900',
          secondary: '#FF1493',
          accent: '#FFA500',
          'bg-start': '#FFF5EC',
          'bg-middle': '#FFE5CC',
          'bg-end': '#FFD6B3',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        whyte: ['Whyte', 'Inter', 'sans-serif'],
        'tt-limes': ['TT Limes Slab', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'button': '0 4px 12px rgba(255, 128, 77, 0.3)',
      },
    },
  },
  plugins: [],
}

