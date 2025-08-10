export interface User {
    email: string;
    first: string;
    last: string;
    public_key: string;
    id: string;
    created: string;
    /**
     * A special tokenized URL where you can send a POST request to re-send the license key to the buyer. The URL is valid for 24 hours only.
     */
    resend_email_endpoint?: string;
}

export interface Purchase {
    tax_rate?: number;
    total_gross?: number;
    amount_per_cycle?: number;
    initial_amount?: number;
    renewal_amount?: number;
    renewals_discount?: number | null;
    renewals_discount_type?: string | null;
    billing_cycle?: number;
    outstanding_balance?: number;
    failed_payments?: number;
    trial_ends?: string | null;
    next_payment?: string;
    canceled_at?: string | null;
    user_id?: string;
    install_id?: string | null;
    plan_id?: string;
    pricing_id?: string;
    license_id?: string;
    ip?: string;
    country_code?: string;
    zip_postal_code?: number;
    vat_id?: string | null;
    coupon_id?: string | null;
    user_card_id?: string;
    source?: number;
    plugin_id?: string;
    external_id?: string;
    gateway?: string;
    environment?: number;
    id?: string;
    created?: string;
    updated?: string | null;
    currency?: string;
    bound_payment_id?: string | null;
    subscription_id?: string | null;
    gateway_fee?: number;
    gross?: number;
    vat?: number;
    is_renewal?: boolean;
    type?: string;
    [key: string]: unknown;
}

export interface CheckoutResponse {
    /**
     * The purchase property is present for premium purchase or paid trials only.
     */
    purchase?: Purchase;
    user: User;
}
