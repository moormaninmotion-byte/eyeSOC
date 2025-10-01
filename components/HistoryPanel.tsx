import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemText, IconButton, Tooltip, Divider, Button } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { HistoryItem } from '../types';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const HistoryPanel: React.FC = () => {
  const { history, isHistoryPanelOpen, setIsHistoryPanelOpen, loadFromHistory, clearHistory } = useAppContext();

  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };
  
  const getSecondaryText = (item: HistoryItem) => {
    if (item.type === 'Script Generation') {
        return `Prompt: "${item.prompt?.substring(0, 50)}..."`;
    }
    if (item.type === 'Log Analysis') {
        return `Analyzed ${item.logs?.length} chars. Focus: ${item.focusTerm || 'None'}`;
    }
    return '';
  };

  return (
    <Drawer
      anchor="right"
      open={isHistoryPanelOpen}
      onClose={() => setIsHistoryPanelOpen(false)}
    >
      <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" component="div">
            Session History
          </Typography>
          <Tooltip title="Close">
            <IconButton onClick={() => setIsHistoryPanelOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {history.length > 0 ? (
            history.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton onClick={() => loadFromHistory(item)}>
                  <ListItemText
                    primary={item.type}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                            {formatTimestamp(item.timestamp)}
                        </Typography>
                        <br />
                        {getSecondaryText(item)}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText secondary="No history yet. Generate a script or analyze logs to get started." sx={{textAlign: 'center', my: 2}} />
            </ListItem>
          )}
        </List>
        {history.length > 0 && (
            <>
                <Divider />
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={clearHistory}
                    >
                        Clear History
                    </Button>
                </Box>
            </>
        )}
      </Box>
    </Drawer>
  );
};

export default HistoryPanel;