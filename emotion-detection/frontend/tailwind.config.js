/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0c",
                card: "rgba(23, 23, 26, 0.7)",
                "card-border": "rgba(255, 255, 255, 0.1)",
                happy: "#10b981", // Emerald-500
                sad: "#3b82f6", // Blue-500
                angry: "#ef4444", // Red-500
                neutral: "#94a3b8", // Slate-400
                surprise: "#f59e0b", // Amber-500
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
