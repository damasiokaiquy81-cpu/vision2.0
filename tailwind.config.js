/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0a0f14',
          text: '#1a2332',
        },
        secondary: {
          bg: '#ffffff',
          text: '#64748b',
        },
        tertiary: {
          bg: '#f8fffe',
        },
        accent: {
          DEFAULT: '#00d4d4',
          hover: '#00a3a3',
          light: '#e6fffe',
        },
        border: '#e2e8f0',
        disabled: '#94a3b8',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        favorite: {
          DEFAULT: '#9ca3af',
          hover: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4d4, #00a3a3)',
        'gradient-bg': 'linear-gradient(135deg, #f8fffe 0%, #ffffff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0f14 0%, #1a2332 100%)',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(15px) scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
      },
      backdropBlur: {
        'xl': '20px',
      },
    },
  },
  plugins: [],
};
