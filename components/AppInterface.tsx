import React, { useState, useEffect } from 'react';
import { 
  HistoryIcon, 
  SettingsIcon, 
  MagicIcon, 
  DownloadIcon, 
  ShareIcon, 
  TrashIcon, 
  LogoIcon,
  RefreshIcon,
  UpscaleIcon
} from './Icons';
import { Tooltip } from './Tooltip';
import { GeneratedAsset, GenerationSettings, STYLES, AspectRatio } from '../types';
import { enhancePrompt, generateImage, upscaleImage } from '../services/geminiService';

interface AppInterfaceProps {
  onBack: () => void;
}

const PROMPT_EXAMPLES = [
  "A futuristic city with neon lights and flying cars, cyberpunk style",
  "A cute cat astronaut floating in space, digital art",
  "A serene Japanese garden with cherry blossoms, watercolor",
  "Portrait of a warrior princess in golden armor, cinematic lighting",
  "A cozy cabin in the snowy woods at night, warm light"
];

const AppInterface: React.FC<AppInterfaceProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<GeneratedAsset | null>(null);
  const [history, setHistory] = useState<GeneratedAsset[]>([]);
  
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: "1:1",
    style: "Cinematic"
  });

  const [showHistory, setShowHistory] = useState(true);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('lulu_history_v2');
    if (saved) {
      try {
        const parsedHistory = JSON.parse(saved);
        // Filter out any video assets from old history
        const imageHistory = parsedHistory.filter((item: any) => item.type === 'image');
        setHistory(imageHistory);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem('lulu_history_v2', JSON.stringify(history));
  }, [history]);

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (error) {
        console.error("Enhance failed", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async (promptOverride?: string) => {
    const promptToUse = typeof promptOverride === 'string' ? promptOverride : prompt;
    
    if (!promptToUse.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const resultUrl = await generateImage(
        promptToUse, 
        settings.aspectRatio, 
        settings.style
      );

      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: promptToUse,
        timestamp: Date.now(),
        aspectRatio: settings.aspectRatio,
        type: 'image'
      };

      setCurrentAsset(newAsset);
      setHistory(prev => [newAsset, ...prev]);

    } catch (error: any) {
      console.error("Generation error:", error);
      alert(`Failed to generate image. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpscale = async () => {
    if (!currentAsset) return;
    
    setIsUpscaling(true);
    // Use isGenerating UI state for the loader
    setIsGenerating(true);

    try {
        const resultUrl = await upscaleImage(
            currentAsset.url,
            currentAsset.prompt,
            currentAsset.aspectRatio as AspectRatio
        );

        const newAsset: GeneratedAsset = {
            id: Date.now().toString(),
            url: resultUrl,
            prompt: currentAsset.prompt + " (Upscaled)",
            timestamp: Date.now(),
            aspectRatio: currentAsset.aspectRatio,
            type: 'image'
        };

        setCurrentAsset(newAsset);
        setHistory(prev => [newAsset, ...prev]);
    } catch (error: any) {
        console.error("Upscale error", error);
        if (error.message === "API_KEY_REQUIRED" && window.aistudio && window.aistudio.openSelectKey) {
             alert("Upscaling to 4K requires a paid API key. Please select one.");
             await window.aistudio.openSelectKey();
        } else {
             alert("Failed to upscale image. Please try again.");
        }
    } finally {
        setIsUpscaling(false);
        setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (currentAsset) {
        setPrompt(currentAsset.prompt);
        handleGenerate(currentAsset.prompt);
    }
  };

  const handleDownload = () => {
    if (!currentAsset) return;
    const link = document.createElement('a');
    link.href = currentAsset.url;
    link.download = `lulu-ai-${currentAsset.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
    if (currentAsset?.id === id) {
        setCurrentAsset(null);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-background text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className={`flex-shrink-0 w-80 glass border-r border-white/10 flex flex-col transition-all duration-300 ${showHistory ? 'translate-x-0' : '-translate-x-full absolute z-20 h-full'}`}>
        
        {/* Logo & Return Section */}
        <div className="p-6 border-b border-white/10 space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0">
                    <LogoIcon className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <h1 className="font-extrabold text-2xl tracking-tight leading-none text-white">lulu</h1>
                    <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mt-0.5">Studio</span>
                </div>
            </div>

            {/* HIGH VISIBILITY RETURN BUTTON */}
            <button 
                onClick={onBack}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="group-hover:-translate-x-1 transition-transform">
                    <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                </svg>
                RETURN HOME
            </button>
        </div>

        <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <SettingsIcon />
              <span>Configuration</span>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1:1', '16:9', '9:16'] as AspectRatio[]).map(ratio => {
                  return (
                    <button
                        key={ratio}
                        onClick={() => setSettings(s => ({ ...s, aspectRatio: ratio }))}
                        className={`text-xs font-bold py-2.5 rounded-lg border transition-all ${
                        settings.aspectRatio === ratio 
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                            : 'border-white/10 hover:bg-white/5 text-slate-400'
                        }`}
                    >
                        {ratio}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Art Style</label>
              <select 
                  value={settings.style}
                  onChange={(e) => setSettings(s => ({ ...s, style: e.target.value }))}
                  className="w-full bg-slate-900/80 border border-white/20 rounded-lg p-3 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                  {STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                  ))}
              </select>
            </div>

             {/* Prompt Examples */}
             <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Inspiration</label>
              <div className="flex flex-col gap-2">
                {PROMPT_EXAMPLES.map((ex, i) => (
                    <button
                        key={i}
                        onClick={() => setPrompt(ex)}
                        className="text-left text-xs font-medium p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all truncate group relative"
                        title={ex}
                    >
                        {ex}
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* History Grid */}
          <div className="space-y-4 pt-4 border-t border-white/10">
             <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-black uppercase tracking-wider">
              <HistoryIcon />
              <span>History</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {history.length === 0 && <p className="col-span-2 text-center text-xs font-medium text-slate-600 py-4">No creations yet.</p>}
              {history.map(item => (
                <div 
                    key={item.id} 
                    onClick={() => setCurrentAsset(item)}
                    className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${currentAsset?.id === item.id ? 'border-indigo-500' : 'border-transparent'}`}
                >
                  <img src={item.url} className="w-full h-full object-cover" alt="History" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Tooltip content="Delete Asset" position="top">
                        <button 
                            onClick={(e) => handleDeleteHistory(item.id, e)}
                            className="p-2 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-lg"
                        >
                            <TrashIcon />
                        </button>
                      </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        
        {/* Mobile Toggle */}
        <div className="md:hidden absolute top-4 left-4 z-30">
            <Tooltip content="Toggle History" position="right">
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-3 glass rounded-xl text-white"
                >
                    <HistoryIcon />
                </button>
            </Tooltip>
        </div>

        {/* Canvas Display */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-90">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] transition-all duration-1000 ${isGenerating ? 'scale-125 opacity-40 animate-pulse-slow' : 'scale-100'}`} />
            </div>

            {/* Empty State */}
            {!currentAsset && !isGenerating && (
                <div className="text-center space-y-6 max-w-md relative z-10 glass p-10 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
                        <LogoIcon className="w-full h-full" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-white mb-2">Ready to Create</h2>
                        <p className="text-slate-400 font-medium">
                            Select a style, type a prompt, and watch the magic happen.
                        </p>
                    </div>
                </div>
            )}

            {/* SciFi Loader */}
            {isGenerating && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
                <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                    {/* Core */}
                    <div className="absolute w-16 h-16 bg-indigo-500 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute w-12 h-12 bg-white rounded-full blur-md animate-pulse"></div>
                    
                    {/* Ring 1 - Fast Spin */}
                    <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-cyan-400 border-b-fuchsia-500 animate-spin"></div>
                    
                    {/* Ring 2 - Dashed Reverse */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/50 animate-spin-reverse-slow"></div>
                    
                    {/* Ring 3 - Outer Orbit */}
                    <div className="absolute inset-[-12px] rounded-full border border-white/5 animate-spin-slow flex items-center justify-center">
                        <div className="absolute -top-1.5 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan]"></div>
                    </div>
                    
                     {/* Ring 4 - Cross Axis */}
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-l-purple-500/50 border-r-purple-500/50 animate-spin-reverse opacity-70"></div>
                </div>
                
                <div className="text-center space-y-3">
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 animate-pulse tracking-widest uppercase">
                        {isUpscaling ? 'Enhancing' : 'Synthesizing'}
                    </h3>
                    <p className="text-cyan-400/70 font-mono text-xs tracking-[0.3em]">
                        {isUpscaling ? 'UPSCALING TO 4K RESOLUTION...' : 'PROCESSING QUANTUM DATA...'}
                    </p>
                </div>
                </div>
            )}

            {/* Result Asset */}
            {currentAsset && !isGenerating && (
                <div className="relative group max-h-full max-w-full shadow-2xl rounded-xl overflow-hidden border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <img 
                        src={currentAsset.url} 
                        alt="Generated" 
                        className={`max-h-[75vh] object-contain shadow-2xl transition-all duration-500`}
                    />
                    
                    {/* Hover Overlay Actions */}
                    <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300 z-30">
                        <Tooltip content="Regenerate" position="bottom">
                            <button 
                                onClick={handleRegenerate}
                                className="p-3.5 glass-card rounded-full hover:bg-white text-white hover:text-black transition-colors shadow-lg" 
                            >
                                <RefreshIcon />
                            </button>
                        </Tooltip>

                        <Tooltip content="Upscale to 4K" position="bottom">
                            <button 
                                onClick={handleUpscale}
                                className="p-3.5 glass-card rounded-full hover:bg-white text-white hover:text-black transition-colors shadow-lg" 
                            >
                                <UpscaleIcon />
                            </button>
                        </Tooltip>

                        <Tooltip content="Download" position="bottom">
                            <button 
                                onClick={handleDownload}
                                className="p-3.5 glass-card rounded-full hover:bg-white text-white hover:text-black transition-colors shadow-lg" 
                            >
                                <DownloadIcon />
                            </button>
                        </Tooltip>
                        
                        <Tooltip content="Share" position="bottom">
                            <button 
                                className="p-3.5 glass-card rounded-full hover:bg-white text-white hover:text-black transition-colors shadow-lg"
                                onClick={() => alert("Sharing functionality would go here!")}
                            >
                                <ShareIcon />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                         <p className="text-sm font-semibold text-white leading-relaxed line-clamp-3 max-w-3xl mx-auto text-center">{currentAsset.prompt}</p>
                    </div>
                </div>
            )}
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-8 left-4 right-4 md:left-20 md:right-20 max-w-4xl mx-auto z-40">
            <div className="glass-input p-2.5 rounded-2xl flex items-center gap-2 shadow-2xl shadow-black/50 border border-white/20 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/30 bg-slate-900/40 backdrop-blur-xl">

                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Enter any prompt to generate an image..."
                    className="flex-1 bg-transparent border-none outline-none text-white font-bold text-lg px-4 py-3 placeholder-slate-400/70"
                    disabled={isGenerating}
                />
                
                <Tooltip content="Enhance prompt with Gemini" position="top">
                    <button 
                        onClick={handleEnhance}
                        disabled={isEnhancing || isGenerating || !prompt}
                        className={`p-3.5 rounded-xl transition-all flex items-center gap-2 text-xs font-black tracking-wide ${
                            isEnhancing ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/10 text-fuchsia-300'
                        }`}
                    >
                    <MagicIcon />
                    <span className="hidden sm:inline">{isEnhancing ? 'ENHANCING...' : 'ENHANCE'}</span>
                    </button>
                </Tooltip>

                <button 
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !prompt}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-black tracking-wide rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
                >
                    {isGenerating ? 'GENERATING...' : 'GENERATE'}
                </button>
            </div>
        </div>

      </main>
    </div>
  );
};

export default AppInterface;