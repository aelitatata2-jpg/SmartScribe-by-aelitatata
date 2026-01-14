
export const DEFAULT_SYSTEM_PROMPT = `Ты профессиональный секретарь и аналитик данных. Проанализируй входящие данные и составь структурированный протокол встречи или резюме контента.

Вывод должен быть на русском языке и включать:
1. Краткое содержание (Executive Summary)
2. Ключевые решения / Основные инсайты
3. Задачи и план действий (Action Items)

Соблюдай формальный, но современный стиль.`;

export const YOUTUBE_PROMPT_SHORT = "Создай краткое резюме этого видео. Выдели основные идеи и цели. Ответ на русском языке.";
export const YOUTUBE_PROMPT_DETAILED = "Проведи подробный и глубокий анализ этого видео. Разбери все ключевые моменты, аргументы и выводы. Ответ на русском языке.";

export const DEFAULT_THEME = {
  bgColor: '#0f172a',
  btnColor: '#3b82f6',
  textColor: '#ffffff',
  bgImage: null,
  overlayOpacity: 0.85
};

export const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
export const GOOGLE_API_SCOPES = 'https://www.googleapis.com/auth/drive.file';
export const GOOGLE_DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
