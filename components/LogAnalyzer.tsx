import React, { useState, useCallback } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Paper, Alert, Collapse, Grid } from '@mui/material';
import MarkdownRenderer from './common/MarkdownRenderer';
import { useAppContext } from '../context/AppContext';
import { analyzeLogs } from '../api/logService';
import { MAX_LOG_LENGTH, sanitizeInput } from '../utils/validation';
import ContextualHelp from './common/ContextualHelp';
import HelpAccordion from './common/HelpAccordion';
import { HistoryType } from '../types';

const LogAnalyzer: React.FC = () => {
  const { 
      apiKey,
      logs, setLogs, 
      analysisResult, setAnalysisResult,
      addHistoryItem
  } = useAppContext();

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [focusTerm, setFocusTerm] = useState('');

  const handleLogsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    if (sanitizedValue.length > MAX_LOG_LENGTH) {
      setValidationError(`Log data cannot exceed ${MAX_LOG_LENGTH} characters.`);
      setLogs(sanitizedValue.substring(0, MAX_LOG_LENGTH));
    } else {
      setValidationError('');
      setLogs(sanitizedValue);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!logs.trim() || !apiKey) return;
    setIsAnalyzing(true);
    setApiError(null);
    setAnalysisResult('');
    try {
      const result = await analyzeLogs(logs, apiKey, focusTerm);
      setAnalysisResult(result);
      addHistoryItem({
        id: crypto.randomUUID(),
        type: HistoryType.LOG,
        timestamp: new Date().toISOString(),
        logs,
        focusTerm,
        analysisResult: result
      });
    } catch (error) {
       setApiError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [logs, apiKey, focusTerm, setAnalysisResult, addHistoryItem]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
        
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" component="h2">Analyze Logs for Incidents & Anomalies</Typography>
              <ContextualHelp title="Paste raw log data to be analyzed for potential security threats and anomalies." />
            </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste log data (e.g., system, firewall, web server) to analyze for threats. Use the optional "Focus Keyword" to guide the AI.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={15}
            variant="outlined"
            value={logs}
            onChange={handleLogsChange}
            placeholder="Paste your log data here..."
            error={!!validationError}
            helperText={validationError}
            disabled={!apiKey}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.875rem' } }}
          />
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
             <Grid item xs={12} sm>
                <TextField 
                    fullWidth
                    variant="outlined"
                    label="Focus Keyword (Optional)"
                    value={focusTerm}
                    onChange={(e) => setFocusTerm(e.target.value)}
                    placeholder="e.g., an IP, username, or error code"
                    disabled={!apiKey}
                    helperText="Direct the AI to focus on a specific term."
                />
             </Grid>
             <Grid item xs={12} sm="auto">
                <Button fullWidth variant="contained" onClick={handleAnalyze} disabled={isAnalyzing || !logs.trim() || !apiKey}>
                  {isAnalyzing && <CircularProgress size={24} sx={{ mr: 1 }}/>}
                  Analyze Logs
                </Button>
            </Grid>
          </Grid>
        </Paper>
        
        <Collapse in={!!analysisResult}>
          {analysisResult && (
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" component="h2" gutterBottom>Analysis Report</Typography>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default' }}>
                <MarkdownRenderer content={analysisResult} />
              </Paper>
            </Paper>
          )}
        </Collapse>
      </Box>
      <HelpAccordion>
        <Typography variant="body2"><strong>What is Log Analysis?</strong><br/>The process of reviewing system-generated records (logs) to identify security events, operational problems, or compliance issues.</Typography>
        <Typography variant="body2"><strong>Using the Focus Keyword:</strong><br/>Provide a specific indicator like an IP address (<code>192.168.1.100</code>), a username (<code>admin</code>), or an event ID (<code>4625</code>) to help the AI narrow its search and provide a more relevant report.</Typography>
        <Typography variant="body2"><strong>Supported Log Types:</strong><br/>Windows Event Logs, Linux syslog, Apache/Nginx web server logs, or firewall logs.</Typography>
      </HelpAccordion>
    </>
  );
};

export default LogAnalyzer;