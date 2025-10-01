import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
  onExecute?: () => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, language, code, onExecute }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <Paper variant="outlined" sx={{ backgroundColor: 'background.default', borderColor: 'divider' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 2, 
          py: 1, 
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
          <Chip label={language} size="small" variant="outlined" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {onExecute && (
             <Tooltip title="Execute Script">
                <IconButton onClick={onExecute} size="small" aria-label="Open execution instructions">
                    <PlayCircleOutlineIcon fontSize="small" />
                </IconButton>
            </Tooltip>
          )}
          <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
            <IconButton onClick={handleCopy} size="small" aria-label="Copy code to clipboard">
              {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box component="pre" sx={{ m: 0, p: 2, overflowX: 'auto' }}>
        <Typography component="code" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
          {code}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CodeBlock;