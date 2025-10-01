import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ContextualHelpProps {
  title: string;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ title }) => {
  return (
    <Tooltip title={title}>
      <IconButton size="small" sx={{ ml: 0.5, color: 'text.secondary' }} aria-label="help">
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default ContextualHelp;