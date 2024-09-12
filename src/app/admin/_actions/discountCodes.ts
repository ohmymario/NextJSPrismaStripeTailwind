"use server"

import db from "@/db/db";
import { DiscountCodeType } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";

const addSchema = z.object({
  code: z.string().min(1).max(255),
  discountAmount: z.coerce.number().int().min(1),
  discountType: z.nativeEnum(DiscountCodeType),
  allProducts: z.coerce.boolean(),
  productIds: z.array(z.string()).optional(),
  expiresAt: z
    .preprocess(
      (value => value === '' ? undefined : value),
      z.coerce.date().min(new Date()).optional(),
    ),
  limit: z
    .preprocess(
      (value => value === '' ? undefined : value),
      z.coerce.number().int().min(1).optional()
    ),
})
  // Validate discount amount 
  // if they are false then the error message should be displayed
  .refine(
    data =>
      data.discountAmount <= 100 ||
      data.discountType !== DiscountCodeType.PERCENTAGE,
    {
      message: 'Discount amount must be less than or equal to 100 for percentage discounts',
      path: ['discountAmount'],
    }
  )
  // Validate a selection is made
  .refine(data => !data.allProducts || data.productIds == null, {
    message: "Cannot select products when all products is selected",
    path: ["productIds"],
  })
  .refine(data => data.allProducts || data.productIds != null, {
    message: "Must select products when all products is not selected",
    path: ["productIds"],
  })


export async function addDiscountCode(_: unknown, formData: FormData) {

  // pre processed form data
  const productIds = formData.getAll('productIds')
  const result = addSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    productIds: productIds.length > 0 ? productIds : undefined,
  });
  if (!result.success) return result.error.formErrors.fieldErrors;

  // post processed form data
  const data = result.data;
  // check for product ids if none then return undefined
  const foundProductIds = data.productIds?.length ? { connect: data.productIds.map((id) => ({ id })) } : undefined

  // Add discount code to db
  await db.discountCode.create({
    data: {
      code: data.code,
      discountAmount: data.discountAmount,
      discountType: data.discountType,
      allProducts: data.allProducts,
      limit: data.limit,
      expiresAt: data.expiresAt,
      products: foundProductIds,
    }
  });

  redirect('/admin/discount-codes');
}