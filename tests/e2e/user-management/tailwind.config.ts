import type { Config } from "tailwindcss";

const baseFontSize = 10.5;

const OnePx = 0.06275;
const Pixel = (value: number) => value * OnePx;

const convertPixelToRem = (pixelValue: number) => {
  const remConversion = pixelValue * OnePx;
  return convertRem(remConversion);
};

const convertRem = (remValue: number | string) => {
  const remValueAsNumber = typeof remValue === "number" ? remValue : parseFloat(remValue);
  if (isNaN(remValueAsNumber)) throw new Error("Invalid rem value provided");

  return `${(16 * remValueAsNumber) / baseFontSize}rem`;
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        background: "#FCFCFC",
        primary: {
          base: "#CF0468",
          50: "#FEF1F9",
          100: "#FFE4F5",
          200: "#FFCAED",
          300: "#FF9EDC",
          400: "#FF62C3",
          500: "#FF34A9",
          600: "#F11186",
          800: "#AD0757",
          900: "#900B4A",
          950: "#590029",
        },
        secondary: {
          base: "#282359",
          50: "#F1F2FD",
          100: "#DFE2FA",
          200: "#C6CCF7",
          300: "#A0ACF0",
          400: "#7281E8",
          500: "#5159E0",
          600: "#3D3CD4",
          700: "#3B33C2",
          800: "#392F9E",
          900: "#302B7D",
        },
        tertiary: {
          purple: {
            base: "#52044C",
            50: "#FEF4FF",
            100: "#FDE8FF",
            200: "#FBD0FE",
            300: "#FBABFC",
            400: "#F979F9",
            500: "#EF46EF",
            600: "#D326CF",
            700: "#AF1CA9",
            800: "#8F1989",
            900: "#751A6E",
          },
          "light-blue": {
            base: "#008DC9",
            50: "#F0FAFF",
            100: "#E0F3FE",
            200: "#B9E9FE",
            300: "#7CD8FD",
            400: "#36C6FA",
            500: "#0CAFEB",
            600: "#0090C8",
            700: "#0170A3",
            800: "#065E86",
            900: "#0B4E6F",
            950: "#07324A",
          },
          yellow: {
            base: "#FDC600",
            50: "#FFFEE7",
            100: "#FFFDC1",
            200: "#FFF686",
            300: "#FFE941",
            400: "#FFD70D",
            600: "#D19100",
            700: "#A66702",
            800: "#89500A",
            900: "#74420F",
            950: "#442204",
          },
        },
        neutral: {
          base: "#3D4543",
          50: "#F6F7F7",
          100: "#E2E5E4",
          200: "#C4CBC9",
          300: "#9EAAA6",
          400: "#7A8783",
          500: "#5F6D69",
          600: "#4B5653",
          800: "#343B39",
          900: "#2E3332",
          950: "#181B1A",
        },
        "status-green": {
          base: "#00BF42",
          50: "#EDFFF3",
          100: "#D6FFE5",
          200: "#AFFFCB",
          300: "#71FFA5",
          400: "#2DFB77",
          500: "#02E554",
          600: "#00BF42",
          700: "#009E3A",
          800: "#06752F",
          900: "#085F29",
          950: "#003615",
        },
        "status-red": {
          base: "#DA1900",
          50: "#FFF4EB",
          100: "#FFE7CF",
          200: "#FFCB9F",
          300: "#FFA562",
          400: "#FF7123",
          500: "#FF4B00",
          600: "#FF2C00",
          700: "#DA1900",
          800: "#9E1200",
          900: "#8A1404",
          950: "#4B0500",
        },
        "status-amber": {
          base: "#EF8200",
          50: "#FFFDE9",
          100: "#FFF8C1",
          200: "#FFF27E",
          300: "#FFE53A",
          400: "#FFD20D",
          500: "#FFAE00",
          600: "#EF8200",
          700: "#C65900",
          800: "#9E4200",
          900: "#833704",
          950: "#4C1B00",
        },
      },
      lineHeight: {
        3: convertRem(0.75),
        4: convertRem(1),
        5: convertRem(1.25),
        6: convertRem(1.5),
        7: convertRem(1.75),
        8: convertRem(2),
        9: convertRem(2.25),
        10: convertRem(2.5),
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      borderWidth: {
        "1": `${convertRem(0.0625)}` /* 1px */,
      },
      fontSize: {
        xs: [
          convertRem(0.625) /* 10px */,
          {
            lineHeight: convertRem(1) /* 16px */,
          },
        ],
        sm: [
          convertRem(0.75) /* 12px */,
          {
            lineHeight: convertRem(1.25) /* 20px */,
          },
        ],
        base: [
          convertRem(1) /* 16px */,
          {
            lineHeight: convertRem(1.5) /* 24px */,
          },
        ],
        lg: [
          convertRem(1.25) /* 20px */,
          {
            lineHeight: convertRem(1.75) /* 28px */,
          },
        ],
        xl: [
          convertRem(1.563) /* 25px */,
          {
            lineHeight: convertRem(2) /* 32px */,
          },
        ],
        "2xl": [
          convertRem(1.938) /* 31px */,
          {
            lineHeight: convertRem(2.5) /* 40px */,
          },
        ],
        "3xl": [
          convertRem(2.438) /* 39px */,
          {
            lineHeight: convertRem(3) /* 48px */,
          },
        ],
        "4xl": [
          convertRem(3.063) /* 49px */,
          {
            lineHeight: convertRem(3.75) /* 60px */,
          },
        ],
      },
      spacing: () => ({
        ...Array.from({ length: 96 }, (_, index) => index * 0.5)
          .filter((i) => i)
          .reduce((acc, i) => ({ ...acc, [i]: `${i / (baseFontSize / 4)}rem` }), {}),
      }),
      borderRadius: {
        sm: `${convertRem(0.125)}` /* 2px */,
        DEFAULT: `${convertRem(0.25)}` /* 4px */,
        md: `${convertRem(0.375)}` /* 6px */,
        lg: `${convertRem(0.5)}` /* 8px */,
        xl: `${convertRem(0.75)}` /* 12px */,
        "2xl": `${convertRem(1)}` /* 16px */,
        "3xl": `${convertRem(1.5)}` /* 24px */,
      },
      minWidth: ({ theme }) => ({
        ...theme("spacing"),
      }),
      maxWidth: ({ theme }) => ({
        ...theme("spacing"),
        0: "0rem",
        xs: `${convertRem(20)}` /* 320px */,
        sm: `${convertRem(24)}` /* 384px */,
        md: `${convertRem(28)}` /* 448px */,
        lg: `${convertRem(32)}` /* 512px */,
        xl: `${convertRem(36)}` /* 576px */,
        "2xl": `${convertRem(42)}` /* 672px */,
        "3xl": `${convertRem(48)}` /* 768px */,
        "4xl": `${convertRem(56)}` /* 896px */,
        "5xl": `${convertRem(64)}` /* 1024px */,
        "6xl": `${convertRem(72)}` /* 1152px */,
        "7xl": `${convertRem(80)}` /* 1280px */,
      }),
      boxShadow: {
        sm: `
          0 ${convertPixelToRem(3)} ${convertPixelToRem(6)} ${convertPixelToRem(-2)} rgba(0, 0, 0, 0.02), 
          0 ${convertPixelToRem(1)} ${convertPixelToRem(1)} 0 rgba(0, 0, 0, 0.04)
          `,
        md: `
          0 ${convertPixelToRem(6)} ${convertPixelToRem(18)} 0 rgba(0, 0, 0, 0.02),
          0 ${convertPixelToRem(3)} ${convertPixelToRem(9)} 0 rgba(0, 0, 0, 0.02),
          0 ${convertPixelToRem(1)} ${convertPixelToRem(1)} 0 rgba(0, 0, 0, 0.04)
          `,
        lg: `
          0 ${convertPixelToRem(9)} ${convertPixelToRem(24)} 0 rgba(0, 0, 0, 0.04),
          0 ${convertPixelToRem(3)} ${convertPixelToRem(18)} 0 rgba(0, 0, 0, 0.02),
          0 ${convertPixelToRem(1)} ${convertPixelToRem(1)} 0 rgba(0, 0, 0, 0.04)
          `,
        xl: `
          0 ${convertPixelToRem(9)} ${convertPixelToRem(48)} 0 rgba(0, 0, 0, 0.08),
          0 ${convertPixelToRem(6)} ${convertPixelToRem(24)} 0 rgba(0, 0, 0, 0.02),
          0 ${convertPixelToRem(1)} ${convertPixelToRem(1)} 0 rgba(0, 0, 0, 0.04)
          `,
        tooltip: `0 ${convertRem(0.1875)} ${convertRem(0.375)} -${convertRem(0.125)} rgba(0, 0, 0, 0.02), 0 1px 1px 0 rgba(0, 0, 0, 0.04)`,
      },
      zIndex: {
        "toast-level": "99", // below slideover which is 100
        "modal-level": "100", // higher than the top nav and the sidenav and slideover
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar-hide")],
  corePlugins: {
    preflight: false, // false to turn off. Preflight adds a tonne of things like a reset stylesheet which clashes with our existing styles
  },
  important: ".tailwind-page", // required to prefix  all tailwind class lists with this for increased specificity. See: https://tailwindcss.com/docs/configuration#selector-strategy
} satisfies Config;
