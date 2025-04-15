import { apiGet, apiPost, apiPut } from "./base";

export interface NotificationPreferences {
  emailUpdates: boolean;
  lawUpdates: boolean;
  newLawsInInterest: boolean;
  contradictions: boolean;
  weeklyDigest: boolean;
}

/**
 * Get user notification preferences
 */
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  return apiGet<NotificationPreferences>("/api/user/preferences/notifications");
};

/**
 * Update user notification preferences
 */
export const updateNotificationPreferences = async (preferences: NotificationPreferences): Promise<void> => {
  return apiPut("/api/user/preferences/notifications", preferences);
};

/**
 * Get user interests (category IDs)
 */
export const getInterests = async (): Promise<string[]> => {
  return apiGet<string[]>("/api/user/preferences/interests");
};

/**
 * Update user interests (category IDs)
 */
export const updateInterests = async (interests: string[]): Promise<void> => {
  return apiPut("/api/user/preferences/interests", { interests });
}; 