import db from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import PurchaseReceiptEmail from '@/email/PurchaseReceipt';

// Initialize Stripe and Resend API clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  // Verify the webhook signature and construct the event
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === 'charge.succeeded') {
    // Extract relevant data from the Stripe charge
    const charge = event.data.object;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    // custom metadata
    const productId = charge.metadata.productId;
    const discountCodeId = charge.metadata.discountCodeId;

    // Lookup the product in our database
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    // Validate product and email exist
    if (!product || !email) {
      return new NextResponse('Product not found', { status: 400 });
    }

    // Prepare user data structure for database operation
    const userFields = {
      email,
      orders: {
        create: {
          productId,
          pricePaidInCents,
          discountCodeId,
        },
      },
    };

    // Upsert user and their order
    // If user exists: adds new order to their history
    // If user doesn't exist: creates new user with this order
    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get only the most recent order
        },
      },
    });

    // if there is a discount code, update the uses
    if (discountCodeId) {
      await db.discountCode.update({
        where: { id: discountCodeId },
        data: { uses: { increment: 1 } },
      });
    }

    // Create a time-limited download verification token
    const downloadVerification = await db.downloadVerifications.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
      },
    });

    // Send confirmation email with download link
    const { data, error } = await resend.emails.send({
      from: 'Support <onboarding@resend.dev>',
      to: email,
      subject: 'Order Confirmaton',
      react: <PurchaseReceiptEmail order={order} downloadVerificationId={downloadVerification.id} product={product} />,
    });
  }

  return new NextResponse();
}
