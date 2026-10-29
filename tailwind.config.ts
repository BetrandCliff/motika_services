import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#073D3B",
        teal: "#0C625B",
        lime: "#C9F36A",
        cream: "#F6F5EF",
        ink: "#172B2A"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(7, 61, 59, .10)"
      }
    }
  },
  plugins: []
};

export default config;
