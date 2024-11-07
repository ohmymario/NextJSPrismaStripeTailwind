import db from "@/db/db";
import { DiscountCode, Prisma } from "@prisma/client";

export function buildActiveDiscountWhere(productId: string) {
  return {
    isActive: true,
    AND: [
      // Validate product applicability (all products or specific product)
      {
        OR: [
          { allProducts: true },
          { products: { some: { id: productId } } },
        ],
      },
      // Validate usage limit
      {
        OR: [
          { limit: null },
          { limit: { gt: db.discountCode.fields.uses } },
        ],
      },
      // Validate expiration
      {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ],
      },
    ],
  } satisfies Prisma.DiscountCodeWhereInput;
}

/**
 * Retrieves a valid discount code for a product
 * @param coupon - The discount code to validate
 * @param productId - The ID of the product to check the discount code against
 * @returns The discount code details if valid, null otherwise
 */

export async function getDiscountCode(coupon: string, productId: string) {
  const discountCode = await db.discountCode.findUnique({
    where: { ...buildActiveDiscountWhere(productId), code: coupon },
    select: {
      id: true,
      discountAmount: true,
      discountType: true,
    },
  });

  return discountCode;
}

/**
 * Calculates the discounted price for a product
 * @param priceInCents - The price of the product in cents
 * @param discountCode - The discount code to apply
 * @returns The discounted price in cents
 */

export function getDiscountedAmount(priceInCents: number, discountCode: Pick<DiscountCode, 'discountAmount' | 'discountType'>) {
  const { discountAmount, discountType } = discountCode;

  function percentageDiscount() {
    return Math.max(
      1,
      Math.ceil(
        priceInCents - (priceInCents * discountAmount) / 100
      )
    )
  }

  function fixedDiscount() {
    return Math.max(
      1,
      Math.ceil(priceInCents - discountAmount * 100)
    )
  }

  if (discountType === 'PERCENTAGE') {
    return percentageDiscount();
  }

  if (discountType === 'FIXED') {
    return fixedDiscount();
  }

  throw new Error(`Invalid discount type ${discountType}`);
}
