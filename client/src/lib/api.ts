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
