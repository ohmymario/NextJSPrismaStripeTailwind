// nextjs and prisma
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@prisma/client';

// components
import { formatCurrency } from '@/lib/formatters';

// shadcn
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

interface PreviewProductCardProps {
  product: Partial<Product>;
}

export default function PreviewProductCard({ product }: PreviewProductCardProps) {
  const { name, description, priceInCents, imagePath } = product;

  const missingFields = [
    !name && 'Name',
    !priceInCents && 'Price',
    !description && 'Description',
    !imagePath && 'Image',
  ].filter(Boolean);

  return (
    <div className='flex flex-col gap-4'>
      {missingFields.length > 0 && (
        <Alert variant='destructive' className='flex gap-4'>
          <div className='flex items-center'>
            <TriangleAlert />
          </div>
          <div>
            <AlertTitle>Missing Required Fields</AlertTitle>
            <AlertDescription>
              Please provide the following required fields: {missingFields.join(', ')}
            </AlertDescription>
          </div>
        </Alert>
      )}

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
