/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Solarica Brand Colors
        'solarica-blue': '#1E3A8A',
        'solarica-green': '#34A853',
        'solarica-bg': '#f6f6f8',
        'solarica-dark': '#f6f6f8',
        // Sales Master Dashboard Colors (Updated)
        "primary": "#2bee79",
        "secondary": "#fde047",
        "background-light": "#f6f6f8",
        "background-dark": "#f6f6f8",
        "surface-light": "#ffffff",
        "surface-dark": "#ffffff",
        "text-main-light": "#111827",
        "text-main-dark": "#ffffff",
        "text-muted-light": "#6b7280",
        "text-muted-dark": "#92c9a8",
        "border-light": "#e5e7eb",
        "border-dark": "#234832",
      },
      fontFamily: {
        "display": ["Spline Sans", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'neumorphism': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
      },
    },
  },
  plugins: [],
}

