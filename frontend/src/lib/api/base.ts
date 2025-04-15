import { getAuthToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Common options for all API requests
 */
const getCommonOptions = async (): Promise<RequestInit> => {
  const token = await getAuthToken();
  
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

/**
 * Generic GET request
 */
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const options = await getCommonOptions();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Generic POST request
 */
export const apiPost = async <T>(endpoint: string, data?: any): Promise<T> => {
  const options = await getCommonOptions();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    ...options,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Generic PUT request
 */
export const apiPut = async <T>(endpoint: string, data?: any): Promise<T> => {
  const options = await getCommonOptions();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    ...options,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Generic DELETE request
 */
export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const options = await getCommonOptions();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}; 