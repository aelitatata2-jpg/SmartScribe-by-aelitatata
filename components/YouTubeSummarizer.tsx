
import React, { useState } from 'react';

interface YouTubeSummarizerProps {
  onProcess: (url: string, mode: 'short' | 'detailed', transcript?: string) => void;
  isProcessing: boolean;
  accentColor: string;
}

const YouTubeSummarizer: React.FC<YouTubeSummarizerProps> = ({ onProcess, isProcessing, accentColor }) => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'short' | 'detailed'>('short');
  const [transcript, setTranscript] = useState('');

  const handleSubmit = () => {
    onProcess(url, mode, transcript);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/20 animate-in fade-in slide-in-from-top-4">
      <h3 className="text-xl font-bold mb-4">Анализ YouTube Видео</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">Ссылка на YouTube видео</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 outline-none transition-all"
            style={{ '--tw-ring-color': accentColor } as any}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">Режим анализа</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="mode" 
                checked={mode === 'short'} 
                onChange={() => setMode('short')}
                className="w-4 h-4"
              />
              <span className="text-sm group-hover:opacity-100 opacity-80 transition-opacity">Краткое резюме</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="mode" 
                checked={mode === 'detailed'} 
                onChange={() => setMode('detailed')}
                className="w-4 h-4"
              />
              <span className="text-sm group-hover:opacity-100 opacity-80 transition-opacity">Подробный анализ</span>
            </label>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <label className="block text-sm font-medium mb-2 opacity-70">Текст субтитров (необязательно, если видео длинное)</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Вставьте текст субтитров здесь для более точного анализа..."
            className="w-full h-32 p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 outline-none transition-all resize-none text-sm"
            style={{ '--tw-ring-color': accentColor } as any}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !url}
            className="px-8 py-3 rounded-xl font-bold text-white shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {isProcessing ? 'Анализируем...' : 'Запустить анализ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeSummarizer;
