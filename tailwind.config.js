/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#F9F7F4",
        "primary-dark": "#F0EBE6",
        "secondary": "#E8EFF7",
        "secondary-alt": "#D8E5D8",
        "accent-primary": "#8B9E8F",
        "accent-secondary": "#6B9CB0",
        "accent-tertiary": "#D07C6E",
        "text-primary": "#2C3E35",
        "text-secondary": "#7A8A7F",
        "success": "#A8BFB0",
        "warning": "#D4A574",
        "danger": "#D07C6E",
      },
      fontFamily: {
        "sans": ["Inter", "Poppins", "sans-serif"],
        "serif": ["Lora", "Georgia", "serif"],
        "accent": ["Playfair Display", "serif"],
      },
      spacing: {
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-in": "slideIn 0.6s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.05)", opacity: 0.8 },
        },
      },
      boxShadow: {
        "card": "0 4px 15px rgba(139, 158, 143, 0.08)",
        "card-hover": "0 12px 24px rgba(139, 158, 143, 0.12)",
        "soft": "0 2px 8px rgba(44, 62, 53, 0.06)",
        "inner-soft": "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-wellness": "linear-gradient(135deg, #F9F7F4 0%, #E8EFF7 50%, #D8E5D8 100%)",
        "gradient-sage": "linear-gradient(135deg, #D8E5D8 0%, #8B9E8F 100%)",
        "gradient-soft": "linear-gradient(135deg, #E8EFF7 0%, #F9F7F4 100%)",
      },
    },
  },
  plugins: [],
}
