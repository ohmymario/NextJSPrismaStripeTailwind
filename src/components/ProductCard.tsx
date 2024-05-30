import { formatCurrency } from '@/lib/formatters';
import { Product } from '@prisma/client';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

export function ProductCard({ product }: { product: Product }) {
  const { name, description, priceInCents, id, imagePath } = product;
  const formattedCurrency = formatCurrency(priceInCents / 100);

  return (
    <div className='flex flex-col overflow-hidden'>
      <Card>
        {/* Image */}
        <div className='relative w-full h-auto aspect-video '>
          <Image src={imagePath} fill alt={name} />
        </div>

        {/* Header */}
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{formattedCurrency}</CardDescription>
        </CardHeader>

        {/* Description */}
        <CardContent className='flex-grow'>
          <p className='line-clamp-4'>{description}</p>
        </CardContent>

        {/* Purchase Link */}
        <CardFooter>
          <Button asChild size='lg' className='w-full'>
            <Link href={`/products/${id}/purchase`}>Purchase</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className='overflow-hidden flex flex-col animate-pulse'>
      <Skeleton className='w-full aspect-video bg-gray-300 ' />
      <CardHeader>
        {/* Card Title */}
        <Skeleton className='w-3/4 h-6 rounded-full bg-gray-300' />

        {/* Card Title Description */}
        <Skeleton className='w-1/2 h-4 rounded-full bg-gray-300' />
      </CardHeader>

      {/* Card Content */}
      <CardContent className='space-y-2'>
        <Skeleton className='w-full h-4 rounded-full bg-gray-300' />
        <Skeleton className='w-full h-4 rounded-full bg-gray-300' />
        <Skeleton className='w-3/4 h-4 rounded-full bg-gray-300' />
      </CardContent>

      {/* Card Footer */}
      <CardFooter>
        <Skeleton className='w-full h-10 rounded bg-gray-600' />
      </CardFooter>
    </Card>
  );
}

// component that takes in number of ProductCardSkeleton to render
export function ProductSkeletonGen({ count }: { count: number }) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
}
