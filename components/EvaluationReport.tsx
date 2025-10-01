import React from 'react';
import { Vulnerability } from '../types';
import { Box, Card, CardContent, Typography, Chip, Alert, Fade } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const getRiskConfig = (riskLevel: Vulnerability['riskLevel']) => {
  switch (riskLevel) {
    case 'High':
      return { icon: <ErrorOutlineIcon />, color: 'error' as const };
    case 'Medium':
      return { icon: <WarningAmberIcon />, color: 'warning' as const };
    case 'Low':
      return { icon: <InfoOutlinedIcon />, color: 'info' as const };
    default:
      return { icon: <InfoOutlinedIcon />, color: 'secondary' as const };
  }
};

const VulnerabilityCard: React.FC<{ vulnerability: Vulnerability }> = ({ vulnerability }) => {
  const { icon, color } = getRiskConfig(vulnerability.riskLevel);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        borderColor: `${color}.main`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0px 4px 20px rgba(0,0,0,0.3)`,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette[color].dark : theme.palette[color].light, color: (theme) => theme.palette.getContrastText(theme.palette[color].main) }}>
        {icon}
        <Typography variant="h6" component="h3" sx={{ flexGrow: 1, fontWeight: 'bold' }}>{vulnerability.vulnerabilityType}</Typography>
        <Chip label={`LINE: ${vulnerability.lineNumber}`} size="small" variant="filled" sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}/>
        <Chip label={`${vulnerability.riskLevel} RISK`} size="small" variant="filled" sx={{ bgcolor: 'rgba(0,0,0,0.2)' }} />
      </Box>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>{vulnerability.explanation}</Typography>
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary.light" gutterBottom>Recommendation:</Typography>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'text.primary' }}>
                {vulnerability.recommendation}
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface EvaluationReportProps {
  vulnerabilities: Vulnerability[];
}

const EvaluationReport: React.FC<EvaluationReportProps> = ({ vulnerabilities }) => {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return (
       <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="inherit" />}>
           No specific security vulnerabilities were found in the script analysis. The improved script below may contain general best-practice enhancements.
       </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {vulnerabilities.map((vuln, index) => (
        <Fade in={true} key={index} timeout={500} style={{ transitionDelay: `${index * 100}ms`}}>
            <div>
              <VulnerabilityCard vulnerability={vuln} />
            </div>
        </Fade>
      ))}
    </Box>
  );
};

export default EvaluationReport;