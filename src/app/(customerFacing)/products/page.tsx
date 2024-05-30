// React
import { Suspense, use } from 'react';

// Components
import { ProductCard, ProductSkeletonGen } from '@/components/ProductCard';

// Fetchers
import { fetchAllProducts } from '@/lib/fetchers';

export default function ProductsPage() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <Suspense fallback={<ProductSkeletonGen count={4} />}>
        <ProductsSuspense />
      </Suspense>
    </div>
  );
}

function ProductsSuspense() {
  const products = use(fetchAllProducts());

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
