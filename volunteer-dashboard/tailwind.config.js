/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // We will use CSS variables for theme switching
                primary: "var(--text-primary)",
                secondary: "var(--text-secondary)",
                tertiary: "var(--text-tertiary)",
                inverse: "var(--text-inverse)",

                bg: {
                    primary: "var(--bg-primary)",
                    secondary: "var(--bg-secondary)",
                    tertiary: "var(--bg-tertiary)",
                    hover: "var(--bg-hover)",
                    border: "var(--bg-border)",
                },

                accent: {
                    blue: {
                        DEFAULT: "var(--accent-blue)",
                        secondary: "var(--accent-blue-secondary)",
                    },
                    cyan: "var(--accent-cyan)",
                    purple: "var(--accent-purple)",
                    green: "var(--accent-green)",
                    yellow: "var(--accent-yellow)",
                    orange: "var(--accent-orange)",
                    red: "var(--accent-red)",
                    pink: "var(--accent-pink)",
                }
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
