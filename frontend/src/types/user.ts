export type UserRole = "admin" | "author" | "reviewer" | "user";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    organization?: string;
    contributionCount: number;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
} 