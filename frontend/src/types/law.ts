export interface Law {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    confidenceScore: number;
    tags: string[];
    supportingPapers: string[];
    contradictingPapers: string[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    archivedAt: string | null;
    status: 'draft' | 'published' | 'archived';
    categoryId?: string;
    sourceUrl?: string;
} 