import db from '@/db/db';
import { cache as reactCache } from 'react';
import { unstable_cache as nextCache } from 'next/cache';

type Callback = (...args: any[]) => Promise<any[]>;
export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: {
    revalidate?: number | false;
    tags?: string[];
  } = {}
) {
  return nextCache(cb, keyParts, options);
}


export const fetchMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: 'desc' } },
      take: 6,
    })
  },
  ["/", "fetchMostPopularProducts"],
  { revalidate: 60 * 60 * 24 });


export const fetchNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
  },
  ["/", "fetchNewestProducts"],
  { revalidate: 60 * 60 * 24 });

export const fetchAllProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
    })
  },
  ["/", "fetchAllProducts"],
  { revalidate: 60 * 60 * 24 });

export const getItem = reactCache((id: string) => {
  return db.product.findUnique({
    where: {
      id,
    },
  });
})