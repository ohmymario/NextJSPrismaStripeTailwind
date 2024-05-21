import { formatCurrency } from '@/lib/formatters';
import { Product } from '@prisma/client';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';

// (parameter) product: {
//     id: string;
//     name: string;
//     priceInCents: number;
//     filePath: string;
//     imagePath: string;
//     description: string;
//     isAvailableForPurchase: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

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
