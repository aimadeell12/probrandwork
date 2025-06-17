import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export interface StripeCardData {
  holderName: string;
  type: 'virtual' | 'physical';
  currency: string;
  spendingControls?: Stripe.Issuing.CardCreateParams.SpendingControls;
}

export interface StripeCardResponse {
  id: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  brand: string;
  status: string;
  type: string;
  cardholder: {
    id: string;
    name: string;
  };
  number?: string; // Only available immediately after creation for virtual cards
}

export class StripeIssuingService {
  
  /**
   * Create a cardholder in Stripe Issuing
   */
  async createCardholder(cardData: StripeCardData): Promise<Stripe.Issuing.Cardholder> {
    try {
      const cardholder = await stripe.issuing.cardholders.create({
        name: cardData.holderName,
        email: `${cardData.holderName.toLowerCase().replace(/\s+/g, '.')}@paydota.com`,
        phone_number: '+1234567890', // This should come from user data
        billing: {
          address: {
            line1: '123 Main Street',
            city: 'New York',
            state: 'NY',
            postal_code: '10001',
            country: 'US',
          },
        },
        type: 'individual',
      });

      return cardholder;
    } catch (error) {
      console.error("Error creating Stripe cardholder:", error);
      throw new Error(`Failed to create cardholder: ${error}`);
    }
  }

  /**
   * Create a card in Stripe Issuing
   */
  async createCard(cardData: StripeCardData): Promise<StripeCardResponse> {
    try {
      // First create a cardholder
      const cardholder = await this.createCardholder(cardData);

      // Create the card
      const card = await stripe.issuing.cards.create({
        cardholder: cardholder.id,
        currency: cardData.currency.toLowerCase(),
        type: cardData.type,
        spending_controls: cardData.spendingControls || {
          spending_limits: [
            {
              amount: 100000, // $1000 limit
              interval: 'monthly' as const,
            },
          ],
        },
      });

      return {
        id: card.id,
        last4: card.last4,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        brand: card.brand,
        status: card.status,
        type: card.type,
        cardholder: {
          id: cardholder.id,
          name: cardholder.name,
        },
        number: card.number, // Available for virtual cards
      };
    } catch (error) {
      console.error("Error creating Stripe card:", error);
      throw new Error(`Failed to create card: ${error}`);
    }
  }

  /**
   * Get card details
   */
  async getCard(cardId: string): Promise<StripeCardResponse> {
    try {
      const card = await stripe.issuing.cards.retrieve(cardId);
      const cardholder = await stripe.issuing.cardholders.retrieve(typeof card.cardholder === 'string' ? card.cardholder : card.cardholder.id);

      return {
        id: card.id,
        last4: card.last4,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        brand: card.brand,
        status: card.status,
        type: card.type,
        cardholder: {
          id: cardholder.id,
          name: cardholder.name,
        },
      };
    } catch (error) {
      console.error("Error retrieving Stripe card:", error);
      throw new Error(`Failed to retrieve card: ${error}`);
    }
  }

  /**
   * Update card status (activate, suspend, cancel)
   */
  async updateCardStatus(cardId: string, status: 'active' | 'inactive' | 'canceled'): Promise<void> {
    try {
      await stripe.issuing.cards.update(cardId, {
        status: status,
      });
    } catch (error) {
      console.error("Error updating Stripe card status:", error);
      throw new Error(`Failed to update card status: ${error}`);
    }
  }

  /**
   * Get card transactions
   */
  async getCardTransactions(cardId: string, limit: number = 100): Promise<Stripe.Issuing.Transaction[]> {
    try {
      const transactions = await stripe.issuing.transactions.list({
        card: cardId,
        limit: limit,
      });

      return transactions.data;
    } catch (error) {
      console.error("Error fetching Stripe card transactions:", error);
      throw new Error(`Failed to fetch transactions: ${error}`);
    }
  }

  /**
   * Update spending controls
   */
  async updateSpendingControls(cardId: string, spendingControls: any): Promise<void> {
    try {
      await stripe.issuing.cards.update(cardId, {
        spending_controls: spendingControls,
      });
    } catch (error) {
      console.error("Error updating spending controls:", error);
      throw new Error(`Failed to update spending controls: ${error}`);
    }
  }

  /**
   * Get card PIN (for physical cards)
   */
  async getCardPin(cardId: string): Promise<{ pin: string }> {
    try {
      // Note: PIN retrieval is not available in all Stripe Issuing implementations
      // This is a placeholder for future implementation
      throw new Error("PIN retrieval not implemented in current Stripe API version");
    } catch (error) {
      console.error("Error retrieving card PIN:", error);
      throw new Error(`Failed to retrieve PIN: ${error}`);
    }
  }
}

export const stripeIssuingService = new StripeIssuingService();