import db from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || !email) {
      return new NextResponse('Product not found', { status: 400 });
    }

    const userFields = {
      email,
      orders: {
        create: {
          productId,
          pricePaidInCents,
        },
      },
    };

    // if the email already exists, update the user's orders
    // if the email doesn't exist, create a new user and add the order
    const res = await db.user.upsert({
      // Find email
      where: { email },
      // create or update user
      create: userFields,
      update: userFields,
      // return the orders
      select: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const order = res.orders[0];
    const downloadVerification = await db.downloadVerifications.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    const { data, error } = await resend.emails.send({
      from: 'Support <onboarding@resend.dev>',
      to: email,
      subject: 'Order Confirmaton',
      react: <h1>Your Order is ready to download</h1>,
    });
  }

  return new NextResponse();
}
