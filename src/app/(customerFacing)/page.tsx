import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { Product } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense, use } from 'react';

// Products sorted by order count descending
async function getMostPopularProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: 'desc' } },
    take: 6,
  });
}

// Products sorted by newest
async function getNewestProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
}

export default async function HomePage() {
  return (
    <main className='space-y-12'>
      <h1>Products</h1>
      <ProductGridSection title='Most Popular' productsFetcher={getMostPopularProducts} />
      <ProductGridSection title='Newest' productsFetcher={getNewestProducts} />
    </main>
  );
}

interface ProductGridSectionProps {
  productsFetcher: () => Promise<Product[]>;
  title: string;
}

function ProductGridSection({ productsFetcher, title }: ProductGridSectionProps) {
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
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductList productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <>
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </>
  );
}

function ProductList({ productsFetcher }: { productsFetcher: () => Promise<Product[]> }) {
  const products = use(productsFetcher());

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
