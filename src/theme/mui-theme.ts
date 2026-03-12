// ─────────────────────────────────────────────────────────────────────────────
// mui-theme.ts
// Application-wide MUI theme.
// Centralised here so palette, typography, and component overrides are never
// scattered across individual component files.
// ─────────────────────────────────────────────────────────────────────────────

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // ── Palette ───────────────────────────────────────────────────────────────
  palette: {
    mode: 'light',
    primary: {
      main:  '#1a56db',
      light: '#4d7fe8',
      dark:  '#1040b0',
    },
    secondary: {
      main: '#6b7280',
    },
    background: {
      default: '#f3f4f6',
      paper:   '#ffffff',
    },
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#16a34a',
    },
  },

  // ── Typography ────────────────────────────────────────────────────────────
  typography: {
    fontFamily: ['"DM Sans"', '"Segoe UI"', 'sans-serif'].join(','),
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    subtitle2: {
      fontWeight: 600,
    },
    body2: {
      lineHeight: 1.6,
    },
  },

  // ── Shape ─────────────────────────────────────────────────────────────────
  shape: {
    borderRadius: 10,
  },

  // ── Component overrides ───────────────────────────────────────────────────
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #e5e7eb',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size:    'medium',
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight:    600,
          borderRadius:  8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#fff',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
