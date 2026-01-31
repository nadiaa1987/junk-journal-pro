
export interface JunkJournalImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  theme: string;
  blob?: Blob;
}

export enum ThemeKey {
  BOTANICAL = 'BOTANICAL',
  STEAMPUNK = 'STEAMPUNK',
  VICTORIAN = 'VICTORIAN',
  CUSTOM = 'CUSTOM'
}

export interface ThemePreset {
  name: string;
  prompt: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
  status: string;
}
