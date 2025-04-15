export interface Citation {
  id: string;
  lawId: string;
  sourceTitle: string;
  authors: string[];
  publicationDate: Date | string;
  excerpt: string;
  url?: string;
  doi?: string;
  confidenceScore: number;
  createdAt: Date | string;
} 