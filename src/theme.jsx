import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#f0f0f0",
          200: "#d1d1d1",
          300: "#b3b3b3",
          400: "#949494",
          500: "#757575",
          600: "#5e5e5e",
          700: "#474747",
          800: "#2e2e2e",
          900: "#141414",
        },
        primary: {
          100: "#e0f2f1",
          200: "#b2dfdb",
          300: "#80cbc4",
          400: "#1F2A40",
          500: "#042F2E", // Dark teal
          600: "#0c101b",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#e0f2f1",
          200: "#b2dfdb",
          300: "#80cbc4",
          400: "#4db6ac",
          500: "#26a69a",
          600: "#0D9488",
          700: "#00796b",
          800: "#00695c",
          900: "#004d40",
        },
        redAccent: {
          100: "#ffebee",
          200: "#ffcdd2",
          300: "#ef9a9a",
          400: "#e57373",
          500: "#f44336",
          600: "#d32f2f",
          700: "#c62828",
          800: "#b71c1c",
          900: "#880e4f",
        },
        blueAccent: {
          100: "#e1f5fe",
          200: "#b3e5fc",
          300: "#81d4fa",
          400: "#4fc3f7",
          500: "#29b6f6",
          600: "#039be5",
          700: "#0288d1",
          800: "#0277bd",
          900: "#01579b",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#2e2e2e",
          300: "#474747",
          400: "#5e5e5e",
          500: "#757575",
          600: "#949494",
          700: "#b3b3b3",
          800: "#d1d1d1",
          900: "#f0f0f0",
        },
        primary: {
          100: "#042F2E",
          200: "#004d40",
          300: "#00695c",
          400: "#FFFFFF", // Glass background (pure white)
          500: "#F7F6F0", // Page background (Creamy White from image)
          600: "#d1d1d1",
          700: "#b3b3b3",
          800: "#949494",
          900: "#757575",
        },
        greenAccent: {
          100: "#004d40",
          200: "#00695c",
          300: "#00796b",
          400: "#0D9488",
          500: "#26a69a",
          600: "#4db6ac",
          700: "#80cbc4",
          800: "#b2dfdb",
          900: "#e0f2f1",
        },
        redAccent: {
          100: "#880e4f",
          200: "#b71c1c",
          300: "#c62828",
          400: "#d32f2f",
          500: "#f44336",
          600: "#e57373",
          700: "#ef9a9a",
          800: "#ffcdd2",
          900: "#ffebee",
        },
        blueAccent: {
          100: "#01579b",
          200: "#0277bd",
          300: "#0288d1",
          400: "#039be5",
          500: "#29b6f6",
          600: "#4fc3f7",
          700: "#81d4fa",
          800: "#b3e5fc",
          900: "#e1f5fe",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[600],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
              paper: colors.primary[400],
            },
            text: {
              primary: colors.grey[100],
              secondary: colors.grey[300],
            }
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[600],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
              paper: colors.primary[400],
            },
            text: {
              primary: colors.grey[100],
              secondary: colors.grey[300],
            }
          }),
    },
    typography: {
      fontFamily: ["Geist Sans", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 48,
        fontWeight: 700,
      },
      h2: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
      },
      h3: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
      },
      h5: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
      },
      h6: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 12,
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 24,
          },
        },
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => {
          const nextMode = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme", nextMode);
          return nextMode;
        }),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};