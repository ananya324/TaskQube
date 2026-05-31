export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",
        "primary-hover": "#0f766e",
        surface: "#ffffff",
        border: "#d1fae5",
        muted: "#2d8a81",
        background: "#f0fdfa",
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}