import db from '@/db/db';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import CheckoutForm from './_components/CheckoutForm';
import { getDiscountCode } from '@/lib/discountCodeHelpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface PurchasePageProps {
  params: { id: string };
  searchParams: { coupon?: string };
}

export default async function PurchasePage({ params: { id }, searchParams: { coupon } }: PurchasePageProps) {
  const product = await db.product.findUnique({ where: { id } });

  if (product === null) return notFound();

  const discountCode = coupon ? await getDiscountCode(coupon, product.id) : null;

  return <CheckoutForm product={product} discountCode={discountCode} />;
}
