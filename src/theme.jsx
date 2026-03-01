import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens export
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
          600: "#0D9488",
          700: "#14B8A6",
        },
        accent: {
          100: "#fff7ed",
          200: "#ffedd5",
          300: "#fed7aa",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        }
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
          400: "#FFFFFF", 
          500: "#F7F6F0", 
        },
        accent: {
          100: "#fff7ed",
          200: "#ffedd5",
          300: "#fed7aa",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        }
      }),
});

// MUI theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: "#0D9488", // Ocean Teal
            },
            secondary: {
              main: "#F97316", // Warm Amber
            },
            neutral: {
              dark: "#474747",
              main: "#757575",
              light: "#f0f0f0",
            },
            background: {
              default: "#042F2E",
              paper: "#043F3D",
            },
            text: {
              primary: "#f0f0f0",
              secondary: "#b3b3b3",
            }
          }
        : {
            primary: {
              main: "#0D9488",
            },
            secondary: {
              main: "#F97316",
            },
            neutral: {
              dark: "#b3b3b3",
              main: "#757575",
              light: "#141414",
            },
            background: {
              default: "#F7F6F0",
              paper: "#FFFFFF",
            },
            text: {
              primary: "#141414",
              secondary: "#474747",
            }
          }),
    },
    typography: {
      fontFamily: ["Geist Sans", "Manrope", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 48,
        fontWeight: 700,
        letterSpacing: "-0.04em",
      },
      h2: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 36,
        fontWeight: 700,
        letterSpacing: "-0.03em",
      },
      h3: {
        fontFamily: ["Geist Sans", "sans-serif"].join(","),
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: "-0.02em",
      },
      h4: {
        fontFamily: ["Manrope", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 600,
      },
      h5: {
        fontFamily: ["Manrope", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 600,
      },
      h6: {
        fontFamily: ["Manrope", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 500,
      },
      body1: {
        fontFamily: ["Manrope", "sans-serif"].join(","),
        fontSize: 16,
      },
      body2: {
        fontFamily: ["Manrope", "sans-serif"].join(","),
        fontSize: 14,
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
            padding: "8px 24px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 8px 16px hsla(var(--primary) / 0.15)",
            }
          },
          containedPrimary: {
            background: "hsl(var(--primary))",
            "&:hover": {
              background: "hsl(var(--primary-glow))",
            }
          }
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            boxShadow: "0 10px 40px -10px hsla(var(--primary) / 0.08)",
            border: "1px solid hsla(var(--primary) / 0.1)",
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid hsla(var(--primary) / 0.05)",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "hsla(var(--primary) / 0.05)",
              borderBottom: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: "hsla(var(--primary) / 0.05)",
            },
          }
        }
      }
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

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
