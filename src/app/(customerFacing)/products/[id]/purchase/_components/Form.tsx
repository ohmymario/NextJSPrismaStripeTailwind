'use client';

// React
import { FormEvent, useRef, useState } from 'react';

// Nextjs
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// stripe
import { StripeLinkAuthenticationElementChangeEvent } from '@stripe/stripe-js';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

// prisma
import { DiscountCode } from '@prisma/client';

// shadcn
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// utils
import { userOrderExists } from '@/app/actions/orders';
import { formatCurrency, formatDiscountType } from '@/lib/formatters';
import { createPaymentIntent } from '@/actions/orders';

interface FormProps {
  priceInCents: number;
  productId: string;
  discountCode?: Pick<DiscountCode, 'id' | 'discountAmount' | 'discountType'> | null;
}

export default function Form({ priceInCents, productId, discountCode }: FormProps) {
  // stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  // react hooks
  const discountCodeRef = useRef<HTMLInputElement>(null);

  // next hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const couponFromParams = searchParams.get('coupon');
  const invalidCoupon = discountCode === null && couponFromParams !== null;

  // state
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    const formSubmit = await elements.submit();
    if (formSubmit.error) {
      setErrorMessage(formSubmit.error.message);
      setIsLoading(false);
      return;
    }

    const paymentIntent = await createPaymentIntent(email, productId, discountCode?.id);

    if (paymentIntent.error) {
      setErrorMessage(paymentIntent.error);
      setIsLoading(false);
      return;
    }

    if (!paymentIntent.clientSecret) return;

    stripe
      .confirmPayment({
        elements,
        clientSecret: paymentIntent.clientSecret,
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

  function handleCoupon() {
    const params = new URLSearchParams(searchParams);
    params.set('coupon', discountCodeRef.current?.value ?? '');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className='text-destructive'>
            {errorMessage && <div>{errorMessage}</div>}
            {invalidCoupon && <div>Invalid coupon code</div>}
          </CardDescription>
        </CardHeader>

        {/* Stripe Payment */}
        <CardContent>
          <PaymentElement />
          <div className='mt-4'>
            <LinkAuthenticationElement onChange={handleEmail} />
          </div>

          {/* Coupon Code */}
          <div className='space-y-2 mt-4'>
            <Label htmlFor='discountCode'>Coupon</Label>
            <div className='flex items-center gap-4 '>
              <Input
                id='discountCode'
                type='text'
                name='discountCode'
                className='w-full max-w-xs'
                defaultValue={couponFromParams ?? ''}
                ref={discountCodeRef}
              />
              <Button onClick={handleCoupon}>Apply</Button>

              {discountCode && (
                <div className='text-sm text-muted-foreground'>{formatDiscountType(discountCode)} discount applied</div>
              )}
            </div>
          </div>
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
