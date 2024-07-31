'use server';

import db from '@/db/db';
import OrderHistoryEmail from '@/email/OrderHistory';
import { Resend } from 'resend';
import { z } from 'zod';

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY);

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
