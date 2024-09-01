/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/** /*.{js,jsx,ts,tsx}", // src 폴더 내의 모든 JavaScript 및 TypeScript 파일
    "./public/index.html", // public 폴더의 index.html 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
