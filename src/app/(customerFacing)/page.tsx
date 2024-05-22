import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { Product } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Products from '../admin/products/page';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Products sorted by order count descending
function getMostPopularProducts() {
  const products = db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: 'desc' } },
    take: 6,
  });

  return products;
}

// Products sorted by newest
function getNewestProducts() {
  const products = db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return products;
}

export default async function HomePage() {
  return (
    <main className='space-y-12'>
      <h1>Products</h1>
      <ProductGridSection productsFetcher={getMostPopularProducts} title='Most Popular' />
      <ProductGridSection productsFetcher={getNewestProducts} title='Newest' />
    </main>
  );
}

interface ProductGridSectionProps {
  productsFetcher: () => Promise<Product[]>;
  title: string;
}

async function ProductGridSection({ productsFetcher, title }: ProductGridSectionProps) {
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        {(await productsFetcher()).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
