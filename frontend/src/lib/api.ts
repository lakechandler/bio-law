import { Law } from "@/types/law";
import { User } from "@/types/user";
import { Notification } from "@/types/notification";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }
  
  return response.json();
}

// Token management
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("authToken", token);
};

const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
};

// Auth API
export const auth = {
  register: async (email: string, password: string, name: string) => {
    const data = await fetchAPI<{ token: string; user: User }>("/user/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    
    setToken(data.token);
    return data;
  },
  
  login: async (email: string, password: string) => {
    const data = await fetchAPI<{ token: string; user: User }>("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    setToken(data.token);
    return data;
  },
  
  logout: () => {
    removeToken();
  },
  
  getUser: async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<User>("/user/getAuthenticatedUser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  updateProfile: async (data: { name?: string; bio?: string; profileImageUrl?: string }) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<User>("/user/updateProfile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, ...data }),
    });
  },
};

// Laws API
export const laws = {
  getAll: async () => {
    return fetchAPI<Law[]>("/law-extraction/getLaws");
  },
  
  getById: async (id: string) => {
    return fetchAPI<Law>(`/law-extraction/getLawById?lawId=${id}`);
  },
  
  search: async (query: string, category?: string) => {
    let url = `/law-extraction/searchLaws?query=${encodeURIComponent(query)}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    return fetchAPI<Law[]>(url);
  },
  
  getCategories: async () => {
    return fetchAPI<{ id: string; name: string; description: string }[]>("/law-extraction/getCategories");
  },
  
  getSaved: async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<string[]>("/user/getSavedLaws", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
  },
  
  saveLaw: async (lawId: string) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ success: boolean }>("/user/saveLaw", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, lawId }),
    });
  },
  
  unsaveLaw: async (lawId: string) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ success: boolean }>("/user/unsaveLaw", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, lawId }),
    });
  },
};

// User preferences API
export const preferences = {
  getInterests: async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<string[]>("/user/getUserInterests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
  },
  
  updateInterests: async (categoryIds: string[]) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ success: boolean }>("/user/updateInterests", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, categoryIds }),
    });
  },
  
  getNotificationPreferences: async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{
      emailUpdates: boolean;
      lawUpdates: boolean;
      newLawsInInterest: boolean;
      contradictions: boolean;
      weeklyDigest: boolean;
    }>("/user/getNotificationPreferences", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
  },
  
  updateNotificationPreferences: async (prefs: {
    emailUpdates?: boolean;
    lawUpdates?: boolean;
    newLawsInInterest?: boolean;
    contradictions?: boolean;
    weeklyDigest?: boolean;
  }) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ success: boolean }>("/user/updateNotificationPreferences", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, ...prefs }),
    });
  },
};

// Notifications API
export const notifications = {
  getAll: async (limit = 20, offset = 0) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ notifications: Notification[]; total: number }>(
      `/notification/getUserNotifications?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token, limit, offset }),
      }
    );
  },
  
  markAsRead: async (notificationId: string) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ success: boolean }>("/notification/markNotificationRead", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, notificationId }),
    });
  },
  
  markAllAsRead: async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ success: boolean }>("/notification/markAllNotificationsRead", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
  },
  
  delete: async (notificationId: string) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    
    return fetchAPI<{ success: boolean }>("/notification/deleteNotification", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, notificationId }),
    });
  },
}; 