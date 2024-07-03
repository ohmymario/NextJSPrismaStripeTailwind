import db from '@/db/db';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import CheckoutForm from './_components/CheckoutForm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface PurchasePageProps {
  params: { id: string };
}

export default async function PurchasePage({ params: { id } }: PurchasePageProps) {
  const product = await db.product.findUnique({ where: { id } });

  // check for product
  if (product === null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: 'USD',
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret === null) {
    throw new Error('Stripe failed to create payment intent.');
  }

  const { client_secret } = paymentIntent;

  return <CheckoutForm product={product} clientSecret={client_secret} />;
}
