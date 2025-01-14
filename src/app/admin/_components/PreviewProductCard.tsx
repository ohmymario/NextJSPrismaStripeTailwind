// nextjs
import Link from 'next/link';
import Image from 'next/image';

// prisma
import { Product } from '@prisma/client';

// components
import { formatCurrency } from '@/lib/formatters';

// shadcn
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewProductCardProps {
  product: Partial<Product>;
}

export default function PreviewProductCard({ product }: PreviewProductCardProps) {
  const { name, description, priceInCents, id, imagePath } = product;
  return (
    <div className='flex flex-col overflow-hidden'>
      <Card>
        {/* Image */}
        <div className='relative w-full h-auto aspect-video '>
          {imagePath && name && <Image src={imagePath} fill alt={name} />}
        </div>

        {/* Header */}
        <CardHeader>
          {name && <CardTitle>{name}</CardTitle>}
          {priceInCents && <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>}
        </CardHeader>

        {/* Description */}
        <CardContent className='flex-grow'>{description && <p className='line-clamp-4'>{description}</p>}</CardContent>

        {/* Purchase Link */}
        <CardFooter>
          <Button asChild size='lg' className='w-full'>
            <Link href='#' onClick={(e) => e.preventDefault()}>
              Purchase
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
