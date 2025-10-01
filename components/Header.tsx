import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { setIsApiKeyDialogOpen, setIsHistoryPanelOpen } = useAppContext();
  
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        <SecurityIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h1" color="text.primary" fontWeight="bold">
            AI Security Agent
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Personal Behavioral Analytics & Forensics Engine
          </Typography>
        </Box>
        <Box>
            <Tooltip title="Settings (API Key)">
                <IconButton color="inherit" onClick={() => setIsApiKeyDialogOpen(true)}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="History">
                <IconButton color="inherit" onClick={() => setIsHistoryPanelOpen(true)}>
                    <HistoryIcon />
                </IconButton>
            </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;