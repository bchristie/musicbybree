/**
 * Types for LyricsEditor component
 */

export type LyricLineData = {
  id?: string;
  text: string;
  time?: number;
  order: number;
  breakAfter?: boolean;
};

export type LyricsData = {
  id?: string;
  hasTiming: boolean;
  source?: string;
  lines: LyricLineData[];
};
