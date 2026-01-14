
import React, { useState, useRef } from 'react';
import { InputType } from '../types';

interface InputSectionProps {
  onProcess: (type: InputType, data: string | File) => void;
  isProcessing: boolean;
  accentColor: string;
}

const InputSection: React.FC<InputSectionProps> = ({ onProcess, isProcessing, accentColor }) => {
  const [activeTab, setActiveTab] = useState<InputType>(InputType.TEXT);
  const [textValue, setTextValue] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTextValue(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
        setAudioFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Ошибка доступа к микрофону:", err);
      alert("Не удалось получить доступ к микрофону.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (activeTab === InputType.TEXT && textValue.trim()) {
      onProcess(InputType.TEXT, textValue);
    } else if (activeTab === InputType.AUDIO && audioFile) {
      onProcess(InputType.AUDIO, audioFile);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab(InputType.TEXT)}
          className={`px-6 py-3 font-medium whitespace-nowrap transition-all ${
            activeTab === InputType.TEXT 
            ? `text-[${accentColor}] border-b-2 border-[${accentColor}]` 
            : 'text-slate-500 hover:text-slate-700'
          }`}
          style={activeTab === InputType.TEXT ? { color: accentColor, borderBottomColor: accentColor } : {}}
        >
          Текстовый ввод
        </button>
        <button
          onClick={() => setActiveTab(InputType.AUDIO)}
          className={`px-6 py-3 font-medium whitespace-nowrap transition-all ${
            activeTab === InputType.AUDIO 
            ? `text-[${accentColor}] border-b-2 border-[${accentColor}]` 
            : 'text-slate-500 hover:text-slate-700'
          }`}
          style={activeTab === InputType.AUDIO ? { color: accentColor, borderBottomColor: accentColor } : {}}
        >
          Аудио файл / Запись
        </button>
      </div>

      <div className="min-h-[250px] flex flex-col justify-between">
        {activeTab === InputType.TEXT ? (
          <div className="flex flex-col gap-4 flex-grow">
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Вставьте стенограмму встречи или черновик заметок здесь..."
              className="w-full flex-grow p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 outline-none transition-all resize-none text-slate-800 dark:text-white"
              style={{ '--tw-ring-color': accentColor } as any}
            />
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Или загрузите файл (.txt, .md):</label>
              <input
                type="file"
                accept=".txt,.md,.text"
                onChange={handleTextFileChange}
                className="text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 hover:border-blue-400 transition-colors">
            <div className="flex gap-4 mb-6">
               <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-md ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-800'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white ${isRecording ? 'animate-ping' : ''}`} />
                {isRecording ? 'Остановить запись' : 'Записать с микрофона'}
              </button>
            </div>
            
            <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mb-6 flex items-center justify-center">
              <span className="bg-white/80 dark:bg-slate-800 px-3 text-xs text-slate-400 uppercase">или загрузите</span>
            </div>

            <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-center">Поддерживаются форматы MP3, WAV, AAC</p>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioFileChange}
              className="block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {audioFile && <p className="mt-4 text-sm text-green-600 font-medium">Готов к обработке: {audioFile.name}</p>}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || isRecording || (activeTab === InputType.TEXT && !textValue.trim()) || (activeTab === InputType.AUDIO && !audioFile)}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ backgroundColor: accentColor }}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </span>
            ) : (
              'Создать протокол'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
