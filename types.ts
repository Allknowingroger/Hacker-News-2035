export interface Story {
  id: string;
  rank: number;
  title: string;
  domain: string;
  points: number;
  user: string;
  time_ago: string;
  comments_count: number;
  tags: string[]; // e.g., "Mars", "AI", "BioTech"
  sentiment: 'positive' | 'neutral' | 'negative' | 'controversial';
  impact_score: number; // A futuristic metric (0-100)
}

export interface NeuralAnalysis {
  summary: string;
  factCheckProbability: number; // 0-100%
  relatedTopics: string[];
  bullCase: string;
  bearCase: string;
}

export interface Comment {
  id: string;
  user: string;
  is_ai: boolean;
  text: string;
  time_ago: string;
  indent_level: number;
}

export enum ViewMode {
  LIST = 'list',
  GRID = 'grid',
  IMMERSIVE = 'immersive'
}