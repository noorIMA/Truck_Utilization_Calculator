/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          colors: {
            background: "hsl(0 0% 100%)",
            foreground: "hsl(222.2 47.4% 11.2%)",
            input: "hsl(214.3 31.8% 91.4%)",
            ring: "hsl(222.2 47.4% 11.2%)",
            popover: "hsl(0 0% 100%)",
            popoverForeground: "hsl(222.2 47.4% 11.2%)",
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(215.4 16.3% 46.9%)",
        },
        accent: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
        },
            primary: {
              DEFAULT: "hsl(222.2 47.4% 11.2%)",
              foreground: "hsl(210 40% 98%)",
            },
            destructive: {
              DEFAULT: "hsl(0 84.2% 60.2%)",
              foreground: "hsl(210 40% 98%)",
            },
            secondary: {
              DEFAULT: "hsl(210 40% 96.1%)",
              foreground: "hsl(222.2 47.4% 11.2%)",
            },
              warning: {
                DEFAULT: "hsl(38 92% 50%)",
                foreground: "hsl(38 96% 10%)",
              },
              success: {
                DEFAULT: "hsl(142.1 76.2% 36.3%)",
                foreground: "hsl(0 0% 98%)",
              },
              info: {
                DEFAULT: "hsl(221.2 83.2% 53.3%)",
                foreground: "hsl(0 0% 98%)",
              },
          },
        },
      },
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.text-no-adjust': {
            'text-size-adjust': 'none',
            '-webkit-text-size-adjust': 'none',
          }
        })
      }
    ],
  }
   