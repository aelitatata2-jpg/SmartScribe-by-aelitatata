
import React, { useState, useEffect } from 'react';
import { ThemeConfig, InputType } from './types';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_THEME, YOUTUBE_PROMPT_SHORT, YOUTUBE_PROMPT_DETAILED } from './constants';
import { processMeetingData } from './services/geminiService';
import { initGoogleApi } from './services/googleDriveService';
import InputSection from './components/InputSection';
import YouTubeSummarizer from './components/YouTubeSummarizer';
import EditorSection from './components/EditorSection';
import SettingsPanel from './components/SettingsPanel';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState<string>(() => localStorage.getItem('scribe_prompt') || DEFAULT_SYSTEM_PROMPT);
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('scribe_theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  const [activeTab, setActiveTab] = useState<'summarizer' | 'youtube'>('summarizer');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initGoogleApi().catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('scribe_prompt', systemPrompt);
  }, [systemPrompt]);

  useEffect(() => {
    localStorage.setItem('scribe_theme', JSON.stringify(theme));
  }, [theme]);

  const handleProcessSummarizer = async (type: InputType, data: string | File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await processMeetingData(type, data, systemPrompt);
      setGeneratedContent(result);
    } catch (err: any) {
      setError(err.message || 'Ошибка обработки.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessYouTube = async (url: string, mode: 'short' | 'detailed', transcript?: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const instruction = mode === 'short' ? YOUTUBE_PROMPT_SHORT : YOUTUBE_PROMPT_DETAILED;
      const content = transcript ? `Transcript: ${transcript}\nURL: ${url}` : `Video URL: ${url}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: content,
        config: {
          systemInstruction: instruction,
          tools: [{ googleSearch: {} }] // Allows Gemini to fetch info about the video if possible
        }
      });
      setGeneratedContent(response.text || "");
    } catch (err: any) {
      setError(err.message || 'Ошибка анализа YouTube.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative transition-colors duration-500 overflow-x-hidden" style={{ backgroundColor: theme.bgColor, color: theme.textColor }}>
      {theme.bgImage && <div className="fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${theme.bgImage})` }} />}
      <div className="fixed inset-0 z-0 transition-opacity duration-500" style={{ backgroundColor: theme.bgColor, opacity: theme.overlayOpacity }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-16">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-2xl text-white shrink-0" style={{ backgroundColor: theme.btnColor }}>S</span>
                <span>Smart Scribe</span>
              </div>
              <span className="text-xl md:text-2xl font-medium opacity-70">by aelitatata</span>
            </h1>
          </div>

          <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/10 transition-all font-bold shrink-0">
            Настройки
          </button>
        </header>

        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <button 
              onClick={() => setActiveTab('summarizer')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'summarizer' ? 'shadow-lg' : 'opacity-50 hover:opacity-100'}`}
              style={activeTab === 'summarizer' ? { backgroundColor: theme.btnColor, color: '#fff' } : {}}
            >
              Саммари встреч
            </button>
            <button 
              onClick={() => setActiveTab('youtube')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'youtube' ? 'shadow-lg' : 'opacity-50 hover:opacity-100'}`}
              style={activeTab === 'youtube' ? { backgroundColor: theme.btnColor, color: '#fff' } : {}}
            >
              YouTube Аналитик
            </button>
          </div>
        </div>

        <main className="space-y-12">
          {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl text-center">{error}</div>}
          
          {activeTab === 'summarizer' ? (
            <InputSection onProcess={handleProcessSummarizer} isProcessing={isProcessing} accentColor={theme.btnColor} />
          ) : (
            <YouTubeSummarizer onProcess={handleProcessYouTube} isProcessing={isProcessing} accentColor={theme.btnColor} />
          )}

          <EditorSection content={generatedContent} onContentChange={setGeneratedContent} accentColor={theme.btnColor} />
        </main>

        <footer className="mt-20 text-center opacity-40 text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Smart Scribe by aelitatata
        </footer>
      </div>

      {isSettingsOpen && (
        <SettingsPanel 
          systemPrompt={systemPrompt} 
          onUpdatePrompt={(p) => { setSystemPrompt(p); setIsSettingsOpen(false); }} 
          theme={theme} 
          onUpdateTheme={(t) => setTheme(prev => ({ ...prev, ...t }))} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
