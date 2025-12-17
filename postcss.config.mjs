const config = {
  plugins: [
    "postcss-import",      // optional, for @import in CSS
    "@tailwindcss/postcss", // required for Tailwind 3+ in Next.js 15
    "autoprefixer"         // optional, adds vendor prefixes
  ],
};

export default config;
