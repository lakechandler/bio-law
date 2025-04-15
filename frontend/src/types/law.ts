export type LawStatus = "draft" | "review" | "published" | "archived";

export interface Law {
    id: string;
    title: string;
    description: string;
    category: string;
    content: string;
    confidenceScore: number;
    citationCount?: number;
    sourceUrl?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    status: LawStatus;
    tags: string[];
    supportingPapers: string[];
    contradictingPapers: string[];
    publishedAt: Date | null;
    archivedAt: Date | null;
    categoryId?: string;
    authorId: string;
    reviewerId?: string;
} 