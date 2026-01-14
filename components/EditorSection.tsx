
import React, { useState, useEffect, useRef } from 'react';
import { saveToDrive } from '../services/googleDriveService';
import { marked } from 'marked';

interface EditorSectionProps {
  content: string;
  onContentChange: (newContent: string) => void;
  accentColor: string;
}

const EditorSection: React.FC<EditorSectionProps> = ({ content, onContentChange, accentColor }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (editorRef.current && content) {
      if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
         if (editorRef.current.innerHTML !== content) {
            editorRef.current.innerHTML = content;
         }
      } else {
        const html = marked.parse(content);
        editorRef.current.innerHTML = html;
      }
    }
  }, [content]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        onContentChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Введите URL ссылки:', 'https://');
    if (url) execCommand('createLink', url);
  };

  const handleEmoji = (emoji: string) => {
    execCommand('insertText', emoji);
    setShowEmojiPicker(false);
  };

  const handleDownloadTxt = () => {
    const textContent = editorRef.current?.innerText || "";
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `SmartScribe_Export_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleSaveToDrive = async () => {
    try {
      setIsSaving(true);
      const htmlContent = editorRef.current?.innerHTML || "";
      await saveToDrive(`SmartScribe_Analysis_${new Date().toLocaleDateString()}`, htmlContent);
      alert('Успешно сохранено в Google Docs!');
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении в Google Docs. Проверьте Client ID.');
    } finally {
      setIsSaving(false);
    }
  };

  const emojis = ['📝', '✅', '❌', '📅', '👤', '💡', '📌', '🤝', '🚀', '🔥', '👍', '👎', '💬', '📢', '🕒'];

  if (!content && (!editorRef.current || !editorRef.current.innerHTML)) return null;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h3 className="text-2xl font-black tracking-tight">Результат Анализа</h3>
          <p className="text-sm opacity-50">Вы можете редактировать текст ниже</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={handleDownloadTxt} className="flex-1 md:flex-none px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-2xl hover:bg-white/5 transition-all font-bold">
            Скачать .txt
          </button>
          <button onClick={handleSaveToDrive} disabled={isSaving} className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-green-900/20">
            {isSaving ? 'Сохранение...' : 'Сохранить в Google Docs'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-200 dark:border-slate-800">
        <ToolbarButton icon="B" title="Жирный" onClick={() => execCommand('bold')} />
        <ToolbarButton icon="I" title="Курсив" onClick={() => execCommand('italic')} className="italic" />
        <ToolbarButton icon="U" title="Подчеркнутый" onClick={() => execCommand('underline')} className="underline" />
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
        <ToolbarButton icon="•" title="Список" onClick={() => execCommand('insertUnorderedList')} />
        <ToolbarButton icon="1." title="Нумерация" onClick={() => execCommand('insertOrderedList')} />
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
        <ToolbarButton icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>} title="Ссылка" onClick={handleLink} />
        <div className="relative">
          <ToolbarButton icon="😊" title="Эмодзи" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl z-20 grid grid-cols-5 gap-2">
              {emojis.map(e => <button key={e} onClick={() => handleEmoji(e)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xl transition-colors">{e}</button>)}
            </div>
          )}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={() => editorRef.current && onContentChange(editorRef.current.innerHTML)}
        className="rich-editor w-full min-h-[600px] p-10 bg-white/5 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 outline-none transition-all text-lg leading-relaxed shadow-inner overflow-y-auto"
        style={{ '--tw-ring-color': `${accentColor}33` } as any}
        data-placeholder="Здесь появится результат анализа..."
      />
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode, title: string, onClick: () => void, className?: string }> = ({ icon, title, onClick, className = "" }) => (
  <button onClick={onClick} title={title} className={`w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all font-black text-lg ${className}`}>
    {icon}
  </button>
);

export default EditorSection;