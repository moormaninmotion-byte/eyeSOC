export enum ScriptType {
  POWERSHELL = 'PowerShell',
  BASH = 'Bash',
}

export enum View {
  SCRIPT_GENERATION = 'SCRIPT_GENERATION',
  LOG_ANALYSIS = 'LOG_ANALYSIS',
  REMEDIATION = 'REMEDIATION',
}

export interface Vulnerability {
  vulnerabilityType: 
    | 'Command Injection' 
    | 'Hardcoded Secret' 
    | 'Insecure Permissions' 
    | 'Insecure Deserialization'
    | 'Weak Encryption'
    | 'Sensitive Data Exposure'
    | 'Best Practice' 
    | 'Other';
  riskLevel: 'High' | 'Medium' | 'Low' | 'Informational';
  lineNumber: string;
  explanation: string;
  recommendation: string;
}

export interface EvaluationResult {
  vulnerabilities: Vulnerability[];
  improvedScript: string;
}

export interface RemediationRecommendation {
    title: string;
    category: 'System Hardening' | 'Privacy' | 'Incident Response' | 'Network Security' | 'General';
    details: string[];
    priority: 'High' | 'Medium' | 'Low';
}

export enum HistoryType {
    SCRIPT = 'Script Generation',
    LOG = 'Log Analysis',
}

export interface HistoryItem {
    id: string;
    type: HistoryType;
    timestamp: string;
    // Script-related data
    prompt?: string;
    scriptType?: ScriptType;
    generatedScript?: string;
    evaluationResult?: EvaluationResult | null;
    // Log-related data
    logs?: string;
    analysisResult?: string;
    focusTerm?: string;
}