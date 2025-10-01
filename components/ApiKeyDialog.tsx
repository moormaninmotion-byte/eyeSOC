import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ApiKeyDialog: React.FC = () => {
    const { apiKey, setApiKey, isApiKeyDialogOpen, setIsApiKeyDialogOpen } = useAppContext();
    const [localKey, setLocalKey] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (apiKey) {
            setLocalKey(apiKey);
        }
    }, [apiKey, isApiKeyDialogOpen]);

    const handleSave = () => {
        if (localKey.trim()) {
            setApiKey(localKey.trim());
            setIsApiKeyDialogOpen(false);
        }
    };

    const handleClose = () => {
        // Only allow closing if a key already exists
        if (apiKey) {
            setIsApiKeyDialogOpen(false);
        }
    };

    return (
        <Dialog open={isApiKeyDialogOpen} onClose={handleClose} disableEscapeKeyDown={!apiKey} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <KeyIcon color="primary" />
                Google Gemini API Key
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    To use the AI Security Agent, please provide your Google Gemini API key. Your key is stored securely in your browser's session storage and is deleted when you close the tab.
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    id="api-key"
                    label="API Key"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="outlined"
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle api key visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don't have a key? Get one from{' '}
                    <Link href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                        Google AI Studio
                    </Link>.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} variant="contained" disabled={!localKey.trim()}>
                    Save Key
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApiKeyDialog;