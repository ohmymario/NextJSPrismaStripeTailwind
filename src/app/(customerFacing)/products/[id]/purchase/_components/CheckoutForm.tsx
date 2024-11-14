'use client';

// Nextjs
import Image from 'next/image';

// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// prisma
import { DiscountCode } from '@prisma/client';

// components
import Form from './Form';

// utils
import { formatCurrency } from '@/lib/formatters';
import { getDiscountedAmount } from '@/lib/discountCodeHelpers';

interface Product {
  id: string;
  imagePath: string;
  name: string;
  priceInCents: number;
  description: string;
}

interface CheckoutFormProps {
  product: Product;
  discountCode?: Pick<DiscountCode, 'id' | 'discountAmount' | 'discountType'> | null;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export default function CheckoutForm({ product, discountCode }: CheckoutFormProps) {
  const adjustedPriceInCents = !discountCode
    ? product.priceInCents
    : getDiscountedAmount(product.priceInCents, discountCode);

  const discountFound = product.priceInCents !== adjustedPriceInCents;

  return (
    <div className='max-w-5xl w-full mx-auto space-y-8'>
      <div className='flex gap-4 items-center'>
        <div className='aspect-video flex-shrink-0 w-1/3 relative'>
          <Image src={product.imagePath} fill alt={product.name} className='object-cover' />
        </div>
        <div>
          <div className='text-lg flex gap-4 items-baseline'>
            {/* Original price crossed out if discount is found */}
            <div className={`${discountFound ? 'line-through text-muted-foreground' : ''}`}>
              {formatCurrency(product.priceInCents / 100)}
            </div>

            {/* Price */}
            {discountFound && <div>{formatCurrency(adjustedPriceInCents / 100)}</div>}
          </div>

          {/* Product name and description */}
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <div className='line-clamp-3 text-muted-foreground'>{product.description}</div>
        </div>
      </div>

      <Elements
        options={{
          amount: adjustedPriceInCents,
          mode: 'payment',
          currency: 'usd',
        }}
        stripe={stripePromise}
      >
        <Form priceInCents={adjustedPriceInCents} productId={product.id} discountCode={discountCode} />
      </Elements>
    </div>
  );
}
