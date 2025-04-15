import { LawStatus } from "./law";

export interface DashboardStats {
  totalLaws: number;
  lawsByStatus: Record<LawStatus, number>;
  recentLaws: number;
  pendingReviews: number;
  averageConfidence: number;
}

export interface ActivityMetric {
  date: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  lawsActivity: ActivityMetric[];
  citationsActivity: ActivityMetric[];
  topContributors: {
    userId: string;
    userName: string;
    avatar?: string;
    contributions: number;
  }[];
} 