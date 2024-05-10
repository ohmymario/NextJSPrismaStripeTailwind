import { cache } from 'react'
import db from '@/db/db'

export const getItem = cache(async (id: string) => {
  const product = await await db.product.findUnique({
    where: {
      id,
    },
  });
  return product;
})