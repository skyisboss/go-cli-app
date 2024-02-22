/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // antd样式冲突
  corePlugins: {
    preflight: false,
  },
}

