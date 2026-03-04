import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2026-02-25.clover',
    });

    const { email, paymentMethodId } = await request.json();

    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRO_PRICE_ID }],
      trial_period_days: 30,
      expand: ['latest_invoice.payment_intent'],
    });

    return NextResponse.json({ subscriptionId: subscription.id, customerId: customer.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
