import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLine = (line: string, index: number) => {
    // Bold text: **text**
    const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (boldedLine.startsWith('### ')) {
      return <Typography key={index} variant="h6" component="h3" gutterBottom dangerouslySetInnerHTML={{ __html: boldedLine.substring(4) }} />;
    }
    if (boldedLine.startsWith('## ')) {
      return <Typography key={index} variant="h5" component="h2" gutterBottom dangerouslySetInnerHTML={{ __html: boldedLine.substring(3) }} />;
    }
    if (boldedLine.startsWith('# ')) {
      return <Typography key={index} variant="h4" component="h1" gutterBottom dangerouslySetInnerHTML={{ __html: boldedLine.substring(2) }} />;
    }
    if (boldedLine.trim().startsWith('- ') || boldedLine.trim().startsWith('* ')) {
      return (
        <ListItem key={index} disableGutters>
          <ListItemIcon sx={{ minWidth: 24 }}><FiberManualRecordIcon sx={{ fontSize: 8 }} /></ListItemIcon>
          <Typography variant="body2" dangerouslySetInnerHTML={{ __html: boldedLine.trim().substring(2) }} />
        </ListItem>
      );
    }
    if (boldedLine.trim() === '') {
      return <Box key={index} sx={{ height: '1em' }} />;
    }
    return <Typography key={index} variant="body2" paragraph dangerouslySetInnerHTML={{ __html: boldedLine }} />;
  };
  
  const elements = [];
  let currentList: string[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    if (isListItem) {
      currentList.push(line);
    } else {
      if (currentList.length > 0) {
        elements.push(<List key={`ul-${index}`} dense>{currentList.map(renderLine)}</List>);
        currentList = [];
      }
      elements.push(renderLine(line, index));
    }
  });

  if (currentList.length > 0) {
    elements.push(<List key="ul-last" dense>{currentList.map(renderLine)}</List>);
  }

  return <Box>{elements}</Box>;
};

export default MarkdownRenderer;