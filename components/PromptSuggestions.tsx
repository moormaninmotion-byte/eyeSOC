import React from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';

interface PromptSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  onSelect: (suggestion: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">Generating ideas...</Typography>
      </Box>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Suggestions</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
                <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => onSelect(suggestion)}
                    variant="outlined"
                    clickable
                />
            ))}
        </Box>
    </Box>
  );
};

export default PromptSuggestions;