import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { Product } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Products sorted by order count descending
async function getMostPopularProducts() {
  const products = await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: 'desc' } },
    take: 6,
  });

  return products;
}

// Products sorted by newest
async function getNewestProducts() {
  const products = await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return products;
}

export default async function HomePage() {
  const PopularProducts = await getMostPopularProducts();
  const NewestProducts = await getNewestProducts();

  return (
    <main className='space-y-12'>
      <h1>Products</h1>
      <ProductGridSection products={PopularProducts} title='Most Popular' />
      <ProductGridSection products={NewestProducts} title='Newest' />
    </main>
  );
}

function ProductGridSection({ products, title }: { products: Product[]; title: string }) {
  return (
    <div className='space-y-4'>
      <div className='flex gap-4'>
        <h2 className='text-3xl font-bold'>{title}</h2>
        <Button variant='outline' asChild>
          <Link href='/products/' className='space-x-2'>
            <span>View All</span>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'></div>;
