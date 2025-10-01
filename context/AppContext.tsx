import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { View, ScriptType, EvaluationResult, RemediationRecommendation, HistoryItem } from '../types';

interface AppContextType {
  // View management
  activeView: View;
  setActiveView: (view: View) => void;
  // API Key management
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isApiKeyDialogOpen: boolean;
  setIsApiKeyDialogOpen: (isOpen: boolean) => void;
  // History management
  history: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;
  loadFromHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  isHistoryPanelOpen: boolean;
  setIsHistoryPanelOpen: (isOpen: boolean) => void;
  // Script state
  prompt: string;
  setPrompt: (prompt: string) => void;
  generatedScript: string;
  setGeneratedScript: (script: string) => void;
  evaluationResult: EvaluationResult | null;
  setEvaluationResult: (result: EvaluationResult | null) => void;
  scriptType: ScriptType;
  setScriptType: (type: ScriptType) => void;
  // Log state
  logs: string;
  setLogs: (logs: string) => void;
  analysisResult: string;
  setAnalysisResult: (result: string) => void;
  // Remediation state
  remediationPlan: RemediationRecommendation[];
  setRemediationPlan: (plan: RemediationRecommendation[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'ai-security-agent-history';
const API_KEY_SESSION_KEY = 'ai-security-agent-apikey';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<View>(View.SCRIPT_GENERATION);
  // API Key State
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState<boolean>(false);
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);
  // Script State
  const [prompt, setPrompt] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [scriptType, setScriptType] = useState<ScriptType>(ScriptType.POWERSHELL);
  // Log State
  const [logs, setLogs] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  // Remediation State
  const [remediationPlan, setRemediationPlan] = useState<RemediationRecommendation[]>([]);

  // API Key side effects
  useEffect(() => {
    const storedKey = sessionStorage.getItem(API_KEY_SESSION_KEY);
    if (storedKey) {
      setApiKeyState(storedKey);
    } else {
      setIsApiKeyDialogOpen(true);
    }
  }, []);

  const setApiKey = (key: string | null) => {
    setApiKeyState(key);
    if (key) {
      sessionStorage.setItem(API_KEY_SESSION_KEY, key);
    } else {
      sessionStorage.removeItem(API_KEY_SESSION_KEY);
    }
  };
  
  // History side effects
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);
  
  const addHistoryItem = useCallback((item: HistoryItem) => {
    setHistory(prevHistory => [item, ...prevHistory.slice(0, 49)]); // Keep latest 50
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const loadFromHistory = useCallback((item: HistoryItem) => {
    if (item.type === 'Script Generation') {
        setPrompt(item.prompt || '');
        setScriptType(item.scriptType || ScriptType.POWERSHELL);
        setGeneratedScript(item.generatedScript || '');
        setEvaluationResult(item.evaluationResult || null);
        // Clear log state
        setLogs('');
        setAnalysisResult('');
        setActiveView(View.SCRIPT_GENERATION);
    } else if (item.type === 'Log Analysis') {
        setLogs(item.logs || '');
        setAnalysisResult(item.analysisResult || '');
        // Clear script state
        setPrompt('');
        setGeneratedScript('');
        setEvaluationResult(null);
        setActiveView(View.LOG_ANALYSIS);
    }
    setRemediationPlan([]); // Always clear remediation plan
    setIsHistoryPanelOpen(false);
  }, []);


  const value = {
    activeView, setActiveView,
    apiKey, setApiKey,
    isApiKeyDialogOpen, setIsApiKeyDialogOpen,
    history, addHistoryItem, loadFromHistory, clearHistory,
    isHistoryPanelOpen, setIsHistoryPanelOpen,
    prompt, setPrompt,
    generatedScript, setGeneratedScript,
    evaluationResult, setEvaluationResult,
    scriptType, setScriptType,
    logs, setLogs,
    analysisResult, setAnalysisResult,
    remediationPlan, setRemediationPlan,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};