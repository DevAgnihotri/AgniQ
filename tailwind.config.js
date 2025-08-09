/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./index.html",
    "./**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'mono': ['Share Tech Mono', 'monospace']
      },
      colors: {
        'cyber-blue': '#0033FF',
        'cyber-red': '#ff4d4d',
        'cyber-pink': '#FF006E',
        'cyber-green': '#39FF14',
        'dark-bg': '#1a0000',
        'neon-cyan': '#00ffff',
        'neon-purple': '#8b00ff',
        'matrix-green': '#00ff41'
      },
      animation: {
        'glitch': 'glitch 2s infinite',
        'fadeIn': 'fadeIn 1s ease-in',
        'slideUp': 'slideUp 0.8s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate'
      },
      boxShadow: {
        'cyber': '0 0 10px rgba(0, 255, 255, 0.5)',
        'cyber-lg': '0 0 20px rgba(0, 255, 255, 0.7)',
        'neon-red': '0 0 10px rgba(255, 77, 77, 0.5)',
        'neon-green': '0 0 10px rgba(57, 255, 20, 0.5)'
      },
      backdropBlur: {
        'cyber': '10px'
      }
    },
  },
  plugins: [],
}
