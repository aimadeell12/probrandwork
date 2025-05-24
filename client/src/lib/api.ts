import { apiRequest } from "./queryClient";

// Card operations
export const cardApi = {
  getCards: () => apiRequest("GET", "/api/cards"),
  createCard: (data: any) => apiRequest("POST", "/api/cards", data),
  suspendCard: (id: string) => apiRequest("PATCH", `/api/cards/${id}/suspend`),
  activateCard: (id: string) => apiRequest("PATCH", `/api/cards/${id}/activate`),
  getTransactions: (cardId: string) => apiRequest("GET", `/api/cards/${cardId}/transactions`),
};

// Support operations
export const supportApi = {
  createTicket: (data: any) => apiRequest("POST", "/api/support/tickets", data),
  getTickets: () => apiRequest("GET", "/api/support/tickets"),
};

// Admin operations
export const adminApi = {
  getUsers: () => apiRequest("GET", "/api/admin/users"),
  getStats: () => apiRequest("GET", "/api/admin/stats"),
};

// User Profile and Settings operations
export const userApi = {
  // Get user profile data
  getProfile: async () => {
    const res = await apiRequest("GET", "/api/user/profile");
    return res.json();
  },
  
  // Update account settings
  updateProfile: async (data: any) => {
    const res = await apiRequest("PATCH", "/api/user/profile", data);
    return res.json();
  },
  
  // Update security settings
  updateSecurity: async (data: any) => {
    const res = await apiRequest("PATCH", "/api/user/security", data);
    return res.json();
  },
  
  // Update notification preferences
  updateNotifications: async (data: any) => {
    const res = await apiRequest("PATCH", "/api/user/notifications", data);
    return res.json();
  },
};
