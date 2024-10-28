'use client';

// React
import { FormEvent, useState } from 'react';

// Nextjs
import Image from 'next/image';

// stripe
import { loadStripe, StripeLinkAuthenticationElementChangeEvent } from '@stripe/stripe-js';
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

// shadcn
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// utils
import { userOrderExists } from '@/app/actions/orders';
import { formatCurrency } from '@/lib/formatters';

interface Product {
  id: string;
  imagePath: string;
  name: string;
  priceInCents: number;
  description: string;
}

interface CheckoutFormProps {
  product: Product;
  clientSecret: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export default function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className='max-w-5xl w-full mx-auto space-y-8'>
      <div className='flex gap-4 items-center'>
        <div className='aspect-video flex-shrink-0 w-1/3 relative'>
          <Image src={product.imagePath} fill alt={product.name} className='object-cover' />
        </div>
        <div>
          <div className='text-lg '>{formatCurrency(product.priceInCents / 100)}</div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <div className='line-clamp-3 text-muted-foreground'>{product.description}</div>
        </div>
      </div>

      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({ priceInCents, productId }: { priceInCents: number; productId: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(`You've already purchased this product. Try downloading it from the My Orders page.`);
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then((res) => {
        const { error } = res;
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(`An unexpected error occurred. Please try again.`);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleEmail(e: StripeLinkAuthenticationElementChangeEvent) {
    setEmail(e.value.email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && <CardDescription className='text-destructive'>{errorMessage}</CardDescription>}
        </CardHeader>

        {/* Stripe Payment */}
        <CardContent>
          <PaymentElement />
          <div className='h-4' />
          <LinkAuthenticationElement onChange={handleEmail} />
        </CardContent>

        <CardFooter>
          <Button className='w-full' size='lg' disabled={stripe == null || elements == null || isLoading}>
            {isLoading ? 'Purchasing...' : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
