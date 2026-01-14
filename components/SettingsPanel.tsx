
import React, { useState } from 'react';
import { ThemeConfig } from '../types';

interface SettingsPanelProps {
  systemPrompt: string;
  onUpdatePrompt: (prompt: string) => void;
  theme: ThemeConfig;
  onUpdateTheme: (theme: Partial<ThemeConfig>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  systemPrompt,
  onUpdatePrompt,
  theme,
  onUpdateTheme,
  onClose
}) => {
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateTheme({ bgImage: reader.result as string });
      };
      const readerData = new FileReader();
      readerData.onload = (ev) => onUpdateTheme({ bgImage: ev.target?.result as string });
      readerData.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    onUpdatePrompt(localPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black uppercase tracking-tight">Настройки Hub</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-12">
          {/* Section 1: Change Prompt */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </span>
              <h3 className="text-lg font-bold">Изменить промт</h3>
            </div>
            <textarea
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              className="w-full h-40 p-5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
              placeholder="Системные инструкции для AI..."
            />
          </section>

          {/* Section 2: Change Appearance */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </span>
              <h3 className="text-lg font-bold">Изменить оформление</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest opacity-40">Фоновый цвет</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={theme.bgColor} onChange={(e) => onUpdateTheme({ bgColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                  <span className="font-mono text-sm opacity-60 uppercase">{theme.bgColor}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest opacity-40">Акцентный цвет</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={theme.btnColor} onChange={(e) => onUpdateTheme({ btnColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                  <span className="font-mono text-sm opacity-60 uppercase">{theme.btnColor}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest opacity-40">Цвет текста</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={theme.textColor} onChange={(e) => onUpdateTheme({ textColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                  <span className="font-mono text-sm opacity-60 uppercase">{theme.textColor}</span>
                </div>
              </div>

              <div className="col-span-full space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-black uppercase tracking-widest opacity-40">Свой фон (изображение)</label>
                <input type="file" accept="image/*" onChange={handleBgImageUpload} className="w-full text-xs opacity-60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-500/10 file:text-blue-500 cursor-pointer" />
                {theme.bgImage && (
                  <button onClick={() => onUpdateTheme({ bgImage: null })} className="text-xs font-bold text-red-500 hover:underline">Удалить фон</button>
                )}
              </div>

              <div className="col-span-full space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40">Прозрачность слоя</label>
                  <span className="text-xs font-black text-blue-500">{Math.round(theme.overlayOpacity * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={theme.overlayOpacity} onChange={(e) => onUpdateTheme({ overlayOpacity: parseFloat(e.target.value) })} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 bg-white dark:bg-slate-900 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Назад
          </button>
          <button
            onClick={handleSaveAll}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
