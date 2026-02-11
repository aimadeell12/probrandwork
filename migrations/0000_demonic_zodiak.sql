CREATE TABLE "bank_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"bank_id" uuid,
	"type" varchar NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"recipient_name" varchar,
	"recipient_bank" varchar,
	"recipient_account" varchar,
	"sender_name" varchar,
	"sender_bank" varchar,
	"sender_account" varchar,
	"reference" varchar,
	"description" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"fee_amount" numeric(12, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"country" varchar NOT NULL,
	"currency" varchar(3) NOT NULL,
	"iban" varchar NOT NULL,
	"account_number" varchar NOT NULL,
	"swift_code" varchar NOT NULL,
	"logo_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "banks_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lithic_card_id" varchar,
	"reap_card_id" varchar,
	"airwallex_card_id" varchar,
	"airwallex_cardholder_id" varchar,
	"holder_name" varchar,
	"card_number" varchar,
	"last_four" varchar(4),
	"cvv" varchar(4),
	"type" varchar NOT NULL,
	"card_type" varchar DEFAULT 'debit' NOT NULL,
	"brand" varchar DEFAULT 'visa',
	"status" varchar DEFAULT 'pending' NOT NULL,
	"balance" numeric(12, 2) DEFAULT '0.00',
	"spending_limit" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"design" varchar DEFAULT 'blue' NOT NULL,
	"expiry_month" integer NOT NULL,
	"expiry_year" integer NOT NULL,
	"international_enabled" boolean DEFAULT true,
	"online_enabled" boolean DEFAULT true,
	"contactless_enabled" boolean DEFAULT true,
	"atm_withdrawals_enabled" boolean DEFAULT true,
	"notifications_enabled" boolean DEFAULT true,
	"shipping_address" jsonb,
	"tracking_number" varchar,
	"shipment_status" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cards_lithic_card_id_unique" UNIQUE("lithic_card_id"),
	CONSTRAINT "cards_reap_card_id_unique" UNIQUE("reap_card_id"),
	CONSTRAINT "cards_airwallex_card_id_unique" UNIQUE("airwallex_card_id")
);
--> statement-breakpoint
CREATE TABLE "currency_conversions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"from_currency" varchar(3) NOT NULL,
	"to_currency" varchar(3) NOT NULL,
	"from_amount" numeric(12, 2) NOT NULL,
	"to_amount" numeric(12, 2) NOT NULL,
	"exchange_rate" numeric(12, 6) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deposit_requests" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"method" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"processed_by" text,
	"transaction_reference" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discussion_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"likes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "discussions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"category" varchar NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"is_popular" boolean DEFAULT false,
	"likes" integer DEFAULT 0,
	"replies" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"registered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"event_date" timestamp NOT NULL,
	"event_time" varchar NOT NULL,
	"max_attendees" integer,
	"current_attendees" integer DEFAULT 0,
	"status" varchar DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_currency" varchar(3) NOT NULL,
	"to_currency" varchar(3) NOT NULL,
	"rate" numeric(12, 6) NOT NULL,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kyc_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kyc_id" uuid NOT NULL,
	"document_type" varchar NOT NULL,
	"file_name" varchar NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"mime_type" varchar,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kyc_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"nationality" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"document_type" varchar NOT NULL,
	"id_number" varchar NOT NULL,
	"phone_number" varchar,
	"email" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"transaction_alerts" boolean DEFAULT true NOT NULL,
	"large_transactions" boolean DEFAULT true NOT NULL,
	"failed_transactions" boolean DEFAULT true NOT NULL,
	"login_alerts" boolean DEFAULT true NOT NULL,
	"password_changes" boolean DEFAULT true NOT NULL,
	"account_changes" boolean DEFAULT true NOT NULL,
	"promotions" boolean DEFAULT false NOT NULL,
	"newsletters" boolean DEFAULT true NOT NULL,
	"product_updates" boolean DEFAULT true NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"push_notifications" boolean DEFAULT true NOT NULL,
	"sms_notifications" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"action_url" text,
	"action_label" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payment_links" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN' NOT NULL,
	"payment_options" varchar DEFAULT 'card' NOT NULL,
	"customer_email" varchar,
	"customer_name" varchar,
	"customer_phone" varchar,
	"tx_ref" varchar NOT NULL,
	"flutterwave_link" text,
	"status" varchar DEFAULT 'active' NOT NULL,
	"redirect_url" text,
	"logo" text,
	"expires_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_links_tx_ref_unique" UNIQUE("tx_ref")
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_link_id" text,
	"user_id" text,
	"tx_ref" varchar NOT NULL,
	"flutterwave_ref" varchar,
	"transaction_id" varchar,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"charged_amount" numeric(12, 2),
	"customer_email" varchar,
	"customer_name" varchar,
	"customer_phone" varchar,
	"payment_method" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"card_number" varchar,
	"card_type" varchar,
	"card_country" varchar,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	CONSTRAINT "payment_transactions_tx_ref_unique" UNIQUE("tx_ref"),
	CONSTRAINT "payment_transactions_flutterwave_ref_unique" UNIQUE("flutterwave_ref"),
	CONSTRAINT "payment_transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "pending_balances" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"transaction_id" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"release_date" timestamp NOT NULL,
	"released_at" timestamp,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_id" varchar NOT NULL,
	"referee_id" varchar,
	"referral_code" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"reward_amount" numeric(10, 2) DEFAULT '25.00',
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	CONSTRAINT "referrals_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"message" text NOT NULL,
	"status" varchar DEFAULT 'open' NOT NULL,
	"priority" varchar DEFAULT 'medium' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"lithic_transaction_id" varchar,
	"airwallex_transaction_id" varchar,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"merchant" varchar,
	"description" text,
	"status" varchar NOT NULL,
	"type" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "transactions_lithic_transaction_id_unique" UNIQUE("lithic_transaction_id"),
	CONSTRAINT "transactions_airwallex_transaction_id_unique" UNIQUE("airwallex_transaction_id")
);
--> statement-breakpoint
CREATE TABLE "user_contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"points" integer DEFAULT 0,
	"badge" varchar DEFAULT 'New Member',
	"helpful_answers" integer DEFAULT 0,
	"discussions_created" integer DEFAULT 0,
	"replies_posted" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"username" varchar,
	"password" varchar,
	"google_id" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"phone" varchar,
	"address" varchar,
	"date_of_birth" varchar,
	"nationality" varchar,
	"id_document_number" varchar,
	"id_document_type" varchar,
	"occupation" varchar,
	"city" varchar,
	"postal_code" varchar,
	"country" varchar DEFAULT 'MAR',
	"role" varchar DEFAULT 'user' NOT NULL,
	"auth_type" varchar DEFAULT 'local' NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"biometric_enabled" boolean DEFAULT false,
	"pin_enabled" boolean DEFAULT false,
	"login_notifications" boolean DEFAULT true,
	"device_tracking" boolean DEFAULT false,
	"email_notifications" boolean DEFAULT true,
	"sms_notifications" boolean DEFAULT false,
	"push_notifications" boolean DEFAULT true,
	"transaction_alerts" boolean DEFAULT true,
	"marketing_emails" boolean DEFAULT false,
	"wallet_balance" numeric(10, 2) DEFAULT '100.00',
	"pending_balance" numeric(10, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"code" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"amount" numeric(10, 2) NOT NULL,
	"type" varchar DEFAULT 'discount' NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency_conversions" ADD CONSTRAINT "currency_conversions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposit_requests" ADD CONSTRAINT "deposit_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposit_requests" ADD CONSTRAINT "deposit_requests_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_kyc_id_kyc_verifications_id_fk" FOREIGN KEY ("kyc_id") REFERENCES "public"."kyc_verifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_verifications" ADD CONSTRAINT "kyc_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payment_link_id_payment_links_id_fk" FOREIGN KEY ("payment_link_id") REFERENCES "public"."payment_links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_balances" ADD CONSTRAINT "pending_balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_balances" ADD CONSTRAINT "pending_balances_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referee_id_users_id_fk" FOREIGN KEY ("referee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_contributions" ADD CONSTRAINT "user_contributions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");