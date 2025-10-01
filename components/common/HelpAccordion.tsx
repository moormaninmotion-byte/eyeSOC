import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';

interface HelpAccordionProps {
  children: React.ReactNode;
}

const HelpAccordion: React.FC<HelpAccordionProps> = ({ children }) => {
  return (
    <Accordion sx={{ mt: 4, backgroundColor: 'background.default' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="subtitle1" color="text.secondary">Learn More & Best Practices</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{
        '& p': { mb: 1.5 },
        '& strong': { color: 'primary.light' },
        '& code': {
            backgroundColor: 'background.paper',
            borderRadius: 1,
            px: 0.5,
            py: '2px',
            fontFamily: 'monospace',
            fontSize: '0.8rem'
        },
        '& li': {
            mb: 0.5
        }
      }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default HelpAccordion;