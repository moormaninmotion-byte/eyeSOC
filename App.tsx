import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container, Box, Paper, Tabs, Tab, Fade } from '@mui/material';
import Header from './components/Header';
import ScriptGenerator from './components/ScriptGenerator';
import LogAnalyzer from './components/LogAnalyzer';
import Remediation from './components/Remediation';
import { useAppContext } from './context/AppContext';
import { View } from './types';
import ApiKeyDialog from './components/ApiKeyDialog';
import HistoryPanel from './components/HistoryPanel';

// A new, high-contrast "cyber" theme with 3D interactive elements
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#29B6F6', // Vibrant Blue
    },
    secondary: {
      main: '#FFA726', // Warm Orange Accent
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#BDBDBD',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
           '&:hover': {
            borderColor: 'rgba(41, 182, 246, 0.5)', // Primary color with alpha
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.2)',
          },
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 3px rgba(0,0,0,0.4)',
          transform: 'translateY(0)',
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
          },
        },
      },
    },
     MuiToggleButton: {
       styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 3px rgba(0,0,0,0.4)',
          transform: 'translateY(0)',
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s ease-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(41, 182, 246, 0.1)',
          },
           '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
          },
          '&.Mui-selected': {
             backgroundColor: 'rgba(41, 182, 246, 0.2)',
             transform: 'translateY(1px)',
             boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transition: 'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
          '&:hover': {
             transform: 'translateY(-2px)',
             boxShadow: '0 4px 20px 0 rgba(0,0,0,0.3)',
             backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px 8px 0 0',
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s ease-out',
          transform: 'translateY(0)',
           '&:hover': {
            transform: 'translateY(-2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: '#1E1E1E', // paper background
            color: '#29B6F6', // primary main
            transform: 'translateY(0)',
            boxShadow: '0 -2px 5px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiTabs: {
        styleOverrides: {
            indicator: {
                display: 'none', // Hide the default indicator, the 3D effect is the new indicator
            }
        }
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
                '&.Mui-focused': {
                    transform: 'scale(1.01)',
                    boxShadow: '0 0 12px 2px rgba(41, 182, 246, 0.5)', // Glow effect
                }
            }
        }
    }
  },
});

const App: React.FC = () => {
  const { activeView, setActiveView } = useAppContext();

  const handleTabChange = (event: React.SyntheticEvent, newValue: View) => {
    setActiveView(newValue);
  };

  const renderView = () => {
    switch (activeView) {
      case View.SCRIPT_GENERATION:
        return <ScriptGenerator />;
      case View.LOG_ANALYSIS:
        return <LogAnalyzer />;
      case View.REMEDIATION:
        return <Remediation />;
      default:
        return <ScriptGenerator />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Container maxWidth="xl" component="main" sx={{ py: 4, flexGrow: 1 }}>
          <Paper elevation={4} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tabs 
                value={activeView} 
                onChange={handleTabChange} 
                aria-label="navigation tabs"
                variant="fullWidth"
              >
                <Tab label="Script Generation & Analysis" value={View.SCRIPT_GENERATION} />
                <Tab label="Log & Forensic Analysis" value={View.LOG_ANALYSIS} />
                <Tab label="Remediation" value={View.REMEDIATION} />
              </Tabs>
            </Box>
            <Fade in={true} key={activeView} timeout={500}>
              <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {renderView()}
              </Box>
            </Fade>
          </Paper>
        </Container>
      </Box>
      <ApiKeyDialog />
      <HistoryPanel />
    </ThemeProvider>
  );
};

export default App;