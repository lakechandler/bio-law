export interface Law {
    id: string;
    title: string;
    summary: string;
    description: string;
    category: string;
    tags: string[];
    supportingPapers: string[];
    contradictingPapers: string[];
    updatedAt: string;
    publishedAt: string;
    confidenceScore: number;
}

export interface Paper {
    title: string;
    authors: string[];
    publishDate: string;
    source: string;
    doi: string;
}

export interface GraphData {
    nodes: {
        id: string;
        title: string;
        category: string;
        confidenceScore: number;
    }[];
    links: {
        source: string;
        target: string;
        relationship: string;
        strength: number;
    }[];
} 