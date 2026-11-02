import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: { sm: "var(--shadow-sm)", md: "var(--shadow-md)" },
    },
  },
};

export default config;
