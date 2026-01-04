import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AppInterface from './components/AppInterface';

const App: React.FC = () => {
  // Simple state-based routing
  const [view, setView] = useState<'landing' | 'app'>('landing');

  return (
    <div className="font-sans antialiased text-slate-100 bg-background min-h-screen selection:bg-indigo-500/30">
       {view === 'landing' ? (
         <div className="animate-in fade-in duration-700">
           <LandingPage onStart={() => setView('app')} />
         </div>
       ) : (
         <div className="animate-in zoom-in-95 duration-500">
           <AppInterface onBack={() => setView('landing')} />
         </div>
       )}
    </div>
  );
};

export default App;