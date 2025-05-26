import { apiRequest } from "./queryClient";

// Card operations
export const cardApi = {
  getCards: () => apiRequest("GET", "/api/cards"),
  createCard: (data: any) => apiRequest("POST", "/api/cards", data),
  suspendCard: (id: string) => apiRequest("PATCH", `/api/cards/${id}/suspend`),
  activateCard: (id: string) => apiRequest("PATCH", `/api/cards/${id}/activate`),
  blockCard: (id: string, reason: string) => apiRequest("PATCH", `/api/cards/${id}/block`, { reason }),
  freezeCard: (id: string) => apiRequest("PATCH", `/api/cards/${id}/freeze`),
  unfreezeCard: (id: string) => apiRequest("PATCH", `/api/cards/${id}/unfreeze`),
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
    try {
      const res = await apiRequest("GET", "/api/user/profile");
      return await res.json();
    } catch (error) {
      console.error("Error fetching profile:", error);
      return {}; // Return empty object to prevent rendering errors
    }
  },
  
  // Update account settings
  updateProfile: async (data: any) => {
    try {
      const res = await apiRequest("PATCH", "/api/user/profile", data);
      return await res.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
  
  // Update security settings
  updateSecurity: async (data: any) => {
    try {
      const res = await apiRequest("PATCH", "/api/user/security", data);
      return await res.json();
    } catch (error) {
      console.error("Error updating security settings:", error);
      throw error;
    }
  },
  
  // Update notification preferences
  updateNotifications: async (data: any) => {
    try {
      const res = await apiRequest("PATCH", "/api/user/notifications", data);
      return await res.json();
    } catch (error) {
      console.error("Error updating notifications:", error);
      throw error;
    }
  },
};
