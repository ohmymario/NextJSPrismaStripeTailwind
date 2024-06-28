"use server"

import db from "@/db/db";

/**
 * Check if a user has already ordered a product
 * @param email - email of the user
 * @param productId - id of the product
 * @returns boolean
 */

export async function userOrderExists(email: string, productId: string) {

  // Find an order in the prism database
  const order = await db.order.findFirst
    ({
      where: { user: { email }, productId },
      select: { id: true },
    });


  // returns boolean
  return !!order;
}