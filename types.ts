
export interface ThemeConfig {
  bgColor: string;
  btnColor: string;
  textColor: string;
  bgImage: string | null;
  overlayOpacity: number;
}

export interface AppSettings {
  systemPrompt: string;
  theme: ThemeConfig;
}

export enum InputType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO'
}

export interface ProcessingResult {
  content: string;
  timestamp: string;
}
