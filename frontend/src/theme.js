// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9575cd', // Desaturated Violet
    },
    secondary: {
      main: '#4dd0e1', // Muted Cyan
    },
    background: {
      default: '#000000',
      paper: '#1E1E1E', 
    },
    text: {
      primary: '#E0E0E0', // Off-white
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
          root: {
            position: 'relative',
            borderRadius: 12,
            boxShadow: 'none',
            backgroundColor: '#1E1E1E',
            padding: '2px', // The width of the border
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '12px',
              padding: '1px',
              background: 'linear-gradient(to right, #9575cd, #4dd0e1)',
              '-webkit-mask': 
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              '-webkit-mask-composite': 'xor',
              maskComposite: 'exclude',
            },
          },
        },
      },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: '#000000',
            }
        }
    },
    MuiToggleButtonGroup: {
        styleOverrides: {
            root: {
                "& .MuiToggleButton-root": {
                    "&.Mui-selected": {
                        backgroundColor: '#9575cd',
                        color: '#000000',
                        "&:hover": {
                            backgroundColor: '#7e57c2',
                        }
                    }
                }
            }
        }
    },
    MuiTabs: {
        styleOverrides: {
            indicator: {
                backgroundColor: '#4dd0e1'
            }
        }
    }
  },
});

export default theme;

