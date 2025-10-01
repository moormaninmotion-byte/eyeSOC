import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, TextField, Button, ToggleButtonGroup, ToggleButton, CircularProgress, Grid, Alert, Collapse, Paper } from '@mui/material';
import { HistoryType, ScriptType } from '../types';
import CodeBlock from './CodeBlock';
import ExecutionWarningModal from './ExecutionWarningModal';
import EvaluationReport from './EvaluationReport';
import PromptSuggestions from './PromptSuggestions';
import { useAppContext } from '../context/AppContext';
import { generateScript, evaluateAndImproveScript, getPromptSuggestions } from '../api/scriptService';
import { MAX_PROMPT_LENGTH, sanitizeInput } from '../utils/validation';
import ContextualHelp from './common/ContextualHelp';
import HelpAccordion from './common/HelpAccordion';

interface ExecutionModalState {
  isOpen: boolean;
  script: string;
  scriptType: ScriptType;
}

const ScriptGenerator: React.FC = () => {
  const {
    apiKey,
    generatedScript, setGeneratedScript,
    evaluationResult, setEvaluationResult,
    scriptType, setScriptType,
    prompt, setPrompt,
    addHistoryItem
  } = useAppContext();

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  
  const [executionModalState, setExecutionModalState] = useState<ExecutionModalState>({
    isOpen: false,
    script: '',
    scriptType: ScriptType.POWERSHELL,
  });
  
  useEffect(() => {
    setSuggestions([]);
    if (prompt.length < 10 || !apiKey) return;

    const handler = setTimeout(() => {
      if (!isGenerating && !isSuggesting) {
        setIsSuggesting(true);
        getPromptSuggestions(prompt, apiKey)
          .then(setSuggestions)
          .catch(error => console.error("Failed to fetch suggestions:", error))
          .finally(() => setIsSuggesting(false));
      }
    }, 1500);

    return () => clearTimeout(handler);
  }, [prompt, isGenerating, isSuggesting, apiKey]);


  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    if (sanitizedValue.length > MAX_PROMPT_LENGTH) {
      setValidationError(`Prompt cannot exceed ${MAX_PROMPT_LENGTH} characters.`);
      setPrompt(sanitizedValue.substring(0, MAX_PROMPT_LENGTH));
    } else {
      setValidationError('');
      setPrompt(sanitizedValue);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || !apiKey) return;
    setIsGenerating(true);
    setApiError(null);
    setGeneratedScript('');
    setEvaluationResult(null);
    setSuggestions([]);
    try {
      const result = await generateScript(prompt, scriptType, apiKey);
      setGeneratedScript(result);
       addHistoryItem({
        id: crypto.randomUUID(),
        type: HistoryType.SCRIPT,
        timestamp: new Date().toISOString(),
        prompt,
        scriptType,
        generatedScript: result,
        evaluationResult: null,
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, scriptType, apiKey, setGeneratedScript, setEvaluationResult, addHistoryItem]);

  const handleEvaluate = useCallback(async () => {
    if (!generatedScript || !apiKey) return;
    setIsEvaluating(true);
    setApiError(null);
    setEvaluationResult(null);
    try {
      const result = await evaluateAndImproveScript(generatedScript, scriptType, apiKey);
      setEvaluationResult(result);
      addHistoryItem({
        id: crypto.randomUUID(),
        type: HistoryType.SCRIPT,
        timestamp: new Date().toISOString(),
        prompt,
        scriptType,
        generatedScript,
        evaluationResult: result,
      });
    } catch (error) {
       setApiError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsEvaluating(false);
    }
  }, [generatedScript, scriptType, apiKey, prompt, addHistoryItem, setEvaluationResult]);

  const handleScriptTypeChange = (event: React.MouseEvent<HTMLElement>, newType: ScriptType | null) => {
    if (newType !== null) setScriptType(newType);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setSuggestions([]);
  };

  const handleOpenExecuteModal = useCallback((script: string, type: ScriptType) => {
    setExecutionModalState({ isOpen: true, script, scriptType: type });
  }, []);

  const handleCloseExecuteModal = useCallback(() => {
    setExecutionModalState((prevState) => ({ ...prevState, isOpen: false }));
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
        
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" component="h2">1. Generate Forensic Script</Typography>
            <ContextualHelp title="Describe the data collection task. The AI will generate a PowerShell or Bash script." />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Describe the forensic data you want to collect. The AI will generate a script to perform the task.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="e.g., 'Collect all running processes and their parent processes on Windows'"
            error={!!validationError}
            helperText={validationError}
            aria-label="Script generation prompt"
            disabled={!apiKey}
          />
          <PromptSuggestions suggestions={suggestions} isLoading={isSuggesting} onSelect={handleSelectSuggestion} />
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm>
              <ToggleButtonGroup value={scriptType} exclusive onChange={handleScriptTypeChange} aria-label="script type">
                <ToggleButton value={ScriptType.POWERSHELL}>{ScriptType.POWERSHELL}</ToggleButton>
                <ToggleButton value={ScriptType.BASH}>{ScriptType.BASH}</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sm="auto" sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Button variant="contained" onClick={handleGenerate} disabled={isGenerating || !prompt.trim() || !apiKey}>
                {isGenerating && <CircularProgress size={24} sx={{ mr: 1 }}/>}
                Generate Script
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        <Collapse in={!!generatedScript}>
          {generatedScript && (
             <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <CodeBlock title="Generated Script" language={scriptType} code={generatedScript} onExecute={() => handleOpenExecuteModal(generatedScript, scriptType)} />
              <Box sx={{ textAlign: 'center' }}>
                <Button variant="contained" onClick={handleEvaluate} disabled={isEvaluating || !apiKey}>
                  {isEvaluating && <CircularProgress size={24} sx={{ mr: 1 }}/>}
                  Evaluate & Improve Script
                </Button>
              </Box>
            </Paper>
          )}
        </Collapse>
        
        <Collapse in={!!evaluationResult}>
            {evaluationResult && (
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>2. Evaluation & Analysis</Typography>
                  <EvaluationReport vulnerabilities={evaluationResult.vulnerabilities} />
                </Box>
                <CodeBlock title="Improved Script" language={scriptType} code={evaluationResult.improvedScript} onExecute={() => handleOpenExecuteModal(evaluationResult.improvedScript, scriptType)} />
              </Paper>
            )}
        </Collapse>
      </Box>

      <HelpAccordion>
        <Typography variant="body2"><strong>What is a Forensic Script?</strong><br/>A forensic script automates the collection of digital evidence from a system.</Typography>
        <Typography variant="body2"><strong>Prompting Best Practices (SANS FOR508):</strong><br/>- Be specific. Define the environment. State your goal.</Typography>
        <Typography variant="body2"><strong>Example Prompts:</strong><br/>- <code>"Get a list of all installed applications on Windows and output to a CSV."</code><br/>- <code>"Find all executable files in the /tmp directory on Linux modified in the last 24 hours."</code></Typography>
      </HelpAccordion>
      
      <ExecutionWarningModal isOpen={executionModalState.isOpen} onClose={handleCloseExecuteModal} script={executionModalState.script} scriptType={executionModalState.scriptType} />
    </>
  );
};

export default ScriptGenerator;