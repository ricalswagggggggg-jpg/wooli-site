import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        night: "#09111f",
        steel: "#8fa4c7",
        mist: "#d7e3ff"
      },
      boxShadow: {
        aura: "0 30px 80px rgba(4, 10, 24, 0.45)",
        panel: "0 20px 60px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(154,180,255,0.16), transparent 28%), radial-gradient(circle at 80% 0%, rgba(84,129,255,0.14), transparent 32%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.06), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
