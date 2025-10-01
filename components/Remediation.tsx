import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Chip, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Alert, Fade } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAppContext } from '../context/AppContext';
import { getRemediationAdvice } from '../api/remediationService';
import { RemediationRecommendation, ScriptType } from '../types';
import ContextualHelp from './common/ContextualHelp';
import HelpAccordion from './common/HelpAccordion';

const PriorityChip: React.FC<{ priority: RemediationRecommendation['priority'] }> = ({ priority }) => {
  const colorMap: { [key in RemediationRecommendation['priority']]: 'error' | 'warning' | 'info' } = {
    High: 'error',
    Medium: 'warning',
    Low: 'info',
  };
  return <Chip label={`${priority} Priority`} color={colorMap[priority]} size="small" />;
};

const Remediation: React.FC = () => {
  const { 
    apiKey,
    generatedScript, evaluationResult, analysisResult, scriptType, logs,
    remediationPlan, setRemediationPlan 
  } = useAppContext();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const buildContext = useCallback((): string => {
    const parts: string[] = [];
    if (analysisResult) parts.push(`## Log Analysis Report\n${analysisResult}`);
    else if (logs) parts.push(`## Raw Logs Provided\n${logs.substring(0, 1000)}...`);
    if (evaluationResult) parts.push(`## Script Evaluation\n${JSON.stringify(evaluationResult.vulnerabilities, null, 2)}`);
    else if (generatedScript) parts.push(`## Generated ${scriptType} Script\n${generatedScript}`);
    if (parts.length > 0) return `Context:\n\n${parts.join('\n\n')}`;
    return `No specific context. Provide general system hardening tips for a ${scriptType === ScriptType.POWERSHELL ? 'Windows' : 'Linux'} environment.`;
  }, [generatedScript, evaluationResult, analysisResult, scriptType, logs]);

  useEffect(() => {
    if (!apiKey) {
      setRemediationPlan([]);
      return;
    };

    const generatePlan = async () => {
        setIsLoading(true);
        setApiError(null);
        setRemediationPlan([]);
        try {
            const context = buildContext();
            const result = await getRemediationAdvice(context, apiKey);
            setRemediationPlan(result);
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    generatePlan();
  }, [buildContext, setRemediationPlan, apiKey]);
  
  const hasContext = !!(analysisResult || logs || generatedScript || evaluationResult);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" component="h2">Remediation & Hardening Plan</Typography>
              <ContextualHelp title="Get an automated, context-aware plan to address identified risks or apply general security best practices." />
            </Box>
          {apiKey && (
            <Alert severity="info" variant="outlined">
              {hasContext
                ? "An actionable remediation plan has been automatically generated based on the available context from other tools."
                : `A general system hardening and privacy plan has been generated for a ${scriptType === ScriptType.POWERSHELL ? 'Windows' : 'Linux'} environment. For more specific advice, generate a script or analyze logs first.`
              }
            </Alert>
          )}
           {!apiKey && (
            <Alert severity="warning">Please set your API key in Settings to use this feature.</Alert>
           )}
        </Box>

        {apiError && <Alert severity="error" sx={{ mt: 2 }}>{apiError}</Alert>}
        
        {isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 1 }}>
              <CircularProgress />
              <Typography color="text.secondary">Generating customized remediation plan...</Typography>
          </Box>
        )}

        {!isLoading && remediationPlan.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {remediationPlan.map((item, index) => (
              <Fade in={true} key={index} timeout={500} style={{ transitionDelay: `${index * 100}ms`}}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', flexWrap: 'wrap' }}>
                      <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>{item.title}</Typography>
                      <Chip label={item.category} size="small" variant="outlined" />
                      <PriorityChip priority={item.priority} />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {item.details.map((detail, i) => (
                        <ListItem key={i}>
                          <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlineIcon color="primary" fontSize="small" /></ListItemIcon>
                          <ListItemText primary={detail} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Fade>
            ))}
          </Box>
        )}
      </Box>
      <HelpAccordion>
        <Typography variant="body2"><strong>What is a Remediation Plan?</strong><br/>This plan provides actionable steps to address vulnerabilities or threats identified in the Script Generation or Log Analysis phases.</Typography>
        <Typography variant="body2"><strong>System Hardening (NSA Guidance):</strong><br/>Hardening is the process of reducing a system's attack surface by disabling unnecessary services, applying patches, and configuring strong security settings.</Typography>
        <Typography variant="body2"><strong>Framework Alignment (NIST):</strong><br/>The plan aligns with the NIST Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover).</Typography>
      </HelpAccordion>
    </>
  );
};

export default Remediation;