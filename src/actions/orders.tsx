'use server';

import db from '@/db/db';
import OrderHistoryEmail from '@/email/OrderHistory';
import { buildActiveDiscountWhere, getDiscountedAmount } from '@/lib/discountCodeHelpers';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY);

const errorMessages = {
  notFound: 'Product not found',
  expiredCode: 'This discount code has expired or is no longer valid',
  alreadyPurchased: 'You have already purchased this product. Try downloading it from the My Orders page.',
  unexpectedError: 'An unexpected error occurred. Please try again.',
  invalidEmail: 'Invalid email',
  stripeError: 'Unknown Stripe error',
};

interface createPaymentIntentResponse {
  clientSecret?: string;
  error?: string;
}

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get('email'));

  if (!result.success) {
    return { error: 'Invalid email' };
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              name: true,
              id: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return { error: 'Check your email to view your order history and download your products.' };
  }

  const orders = await Promise.all(
    user.orders.map(async (order) => {
      const downloadVerification = await db.downloadVerifications.create({
        data: {
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          productId: order.product.id,
        },
      });

      return {
        ...order,
        downloadVerificationId: downloadVerification.id as string,
      };
    })
  );

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: 'Your Order History',
    react: <OrderHistoryEmail orders={orders} />,
  });

  if (data.error) {
    return { error: 'Failed to send email' };
  }

  return { message: 'Email sent!', error: undefined };
}

export async function createPaymentIntent(
  email: string,
  productId: string,
  discountCodeId?: string
): Promise<createPaymentIntentResponse> {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(errorMessages.notFound);
    }

    const discountCode = discountCodeId
      ? await db.discountCode.findUnique({
          where: { id: discountCodeId, ...buildActiveDiscountWhere(productId) },
        })
      : null;

    if (discountCodeId && !discountCode) {
      throw new Error(errorMessages.expiredCode);
    }

    const existingOrder = await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    });

    if (existingOrder) {
      throw new Error(errorMessages.alreadyPurchased);
    }

    const finalPriceInCents = !discountCode
      ? product.priceInCents
      : getDiscountedAmount(product.priceInCents, discountCode);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalPriceInCents,
      currency: 'USD',
      metadata: {
        productId: product.id,
        discountCodeId: discountCode?.id ?? null,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error(errorMessages.stripeError);
    }

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return {
      error: error instanceof Error ? error.message : errorMessages.unexpectedError,
    };
  }
}
