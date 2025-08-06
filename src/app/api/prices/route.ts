// /src/app/api/prices/route.ts (for app router)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const allowedPriceIds = [
  process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
  process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
  process.env.STRIPE_PRO_YEARLY_PRICE_ID,
];

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    const filtered = prices.data.filter(price => allowedPriceIds.includes(price.id));

    // Group prices by product
    const groupedByProduct: { [productId: string]: {
      product: Stripe.Product,
      monthlyPrice?: Stripe.Price,
      yearlyPrice?: Stripe.Price
    } } = {};

    filtered.forEach(price => {
      const productId = typeof price.product === 'string' ? price.product : price.product?.id;
      const product = typeof price.product === 'string' ? null : price.product;

      if (!productId || !product || 'deleted' in product) return;

      if (!groupedByProduct[productId]) {
        groupedByProduct[productId] = { product: product as Stripe.Product };
      }

      if (price.recurring?.interval === 'month') {
        groupedByProduct[productId].monthlyPrice = price;
      } else if (price.recurring?.interval === 'year') {
        groupedByProduct[productId].yearlyPrice = price;
      }
    });

    // Convert to array format expected by frontend
    const result = Object.values(groupedByProduct).filter(item => item.product);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Unable to fetch prices' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
