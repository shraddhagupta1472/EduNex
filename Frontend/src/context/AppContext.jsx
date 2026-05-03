import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [initialTestResults, setInitialTestResults] = useState(null);
  const [retestResults, setRetestResults] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);

  const value = {
    sessionId, setSessionId,
    initialTestResults, setInitialTestResults,
    retestResults, setRetestResults,
    analysisData, setAnalysisData,
    studyPlan, setStudyPlan
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
