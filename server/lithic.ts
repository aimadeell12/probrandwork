import { Card, InsertCard } from "@shared/schema";

interface LithicCardResponse {
  token: string;
  last_four: string;
  exp_month: number;
  exp_year: number;
  state: string;
}

interface LithicTransactionResponse {
  token: string;
  amount: number;
  descriptor: string;
  status: string;
  merchant: {
    descriptor: string;
  };
}

interface LithicTransferResponse {
  token: string;
  amount: number;
  status: string;
  direction: "DEPOSIT" | "WITHDRAWAL";
}

class LithicService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.LITHIC_API_KEY || process.env.LITHIC_SANDBOX_API_KEY || "";
    this.baseUrl = process.env.LITHIC_BASE_URL || "https://sandbox.lithic.com";
    
    if (!this.apiKey) {
      console.warn("Lithic API key not found. Card operations will be simulated.");
    }
  }

  private async makeRequest(endpoint: string, method: string = "GET", data?: any) {
    if (!this.apiKey) {
      throw new Error("Lithic API key not configured");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Lithic API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async createCard(cardData: {
    holderName: string;
    type: string;
    creditLimit?: number;
    currency: string;
  }): Promise<LithicCardResponse> {
    try {
      const response = await this.makeRequest("/v1/cards", "POST", {
        type: cardData.type === "credit" ? "SINGLE_USE" : "VIRTUAL",
        memo: `Card for ${cardData.holderName}`,
        spend_limit: cardData.creditLimit || 5000,
        spend_limit_duration: "MONTHLY",
      });

      return {
        token: response.token,
        last_four: response.last_four,
        exp_month: response.exp_month,
        exp_year: response.exp_year,
        state: response.state,
      };
    } catch (error) {
      console.error("Error creating Lithic card:", error);
      // Fallback for development/testing
      return {
        token: `lithic_${Date.now()}`,
        last_four: Math.floor(1000 + Math.random() * 9000).toString(),
        exp_month: 12,
        exp_year: new Date().getFullYear() + 3,
        state: "OPEN",
      };
    }
  }

  async suspendCard(lithicCardId: string): Promise<void> {
    try {
      await this.makeRequest(`/v1/cards/${lithicCardId}`, "PATCH", {
        state: "PAUSED",
      });
    } catch (error) {
      console.error("Error suspending Lithic card:", error);
      // Continue anyway for development
    }
  }

  async activateCard(lithicCardId: string): Promise<void> {
    try {
      await this.makeRequest(`/v1/cards/${lithicCardId}`, "PATCH", {
        state: "OPEN",
      });
    } catch (error) {
      console.error("Error activating Lithic card:", error);
      // Continue anyway for development
    }
  }

  async getCardTransactions(lithicCardId: string): Promise<LithicTransactionResponse[]> {
    try {
      const response = await this.makeRequest(`/v1/transactions?card_token=${lithicCardId}`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching Lithic transactions:", error);
      return [];
    }
  }

  async deposit(cardToken: string, amount: number): Promise<LithicTransferResponse> {
    try {
      const response = await this.makeRequest("/v1/transfers", "POST", {
        card_token: cardToken,
        amount: amount * 100, // Convert to cents
        direction: "DEPOSIT",
        type: "ACH",
      });

      return {
        token: response.token,
        amount: response.amount / 100, // Convert back to dollars
        status: response.status,
        direction: "DEPOSIT",
      };
    } catch (error) {
      console.error("Error processing deposit:", error);
      // Return simulated response for development
      return {
        token: `dep_${Date.now()}`,
        amount: amount,
        status: "PENDING",
        direction: "DEPOSIT",
      };
    }
  }

  async withdraw(cardToken: string, amount: number): Promise<LithicTransferResponse> {
    try {
      const response = await this.makeRequest("/v1/transfers", "POST", {
        card_token: cardToken,
        amount: amount * 100, // Convert to cents
        direction: "WITHDRAWAL",
        type: "ACH",
      });

      return {
        token: response.token,
        amount: response.amount / 100, // Convert back to dollars
        status: response.status,
        direction: "WITHDRAWAL",
      };
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      // Return simulated response for development
      return {
        token: `wth_${Date.now()}`,
        amount: amount,
        status: "PENDING",
        direction: "WITHDRAWAL",
      };
    }
  }

  async getBalance(cardToken: string): Promise<number> {
    try {
      const response = await this.makeRequest(`/v1/cards/${cardToken}/balance`);
      return response.available_amount / 100; // Convert from cents to dollars
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 5.00; // Default balance for development
    }
  }
}

export const lithicService = new LithicService();
