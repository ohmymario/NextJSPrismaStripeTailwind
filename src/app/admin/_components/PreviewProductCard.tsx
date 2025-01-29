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
import { Terminal, TriangleAlert } from 'lucide-react';

interface PreviewProductCardProps {
  product: Partial<Product>;
}

export default function PreviewProductCard({ product }: PreviewProductCardProps) {
  const { name, description, priceInCents, id, imagePath, filePath, isAvailableForPurchase, createdAt, updatedAt } =
    product;

  const missingFields = [
    !name && 'Name',
    !priceInCents && 'Price',
    !description && 'Description',
    !filePath && 'File',
    !imagePath && 'Image',
  ].filter(Boolean);

  return (
    <div className='flex flex-col gap-4 overflow-hidden'>
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

      <Card className='h-fit'>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Complete product information</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-[100px_1fr] gap-2'>
            <span className='font-medium'>ID:</span>
            <span className='truncate'>{id || 'Not set'}</span>

            <span className='font-medium'>Name:</span>
            <span className='truncate'>{name || 'Not set'}</span>

            <span className='font-medium'>Price:</span>
            <span>{priceInCents ? formatCurrency(priceInCents / 100) : 'Not set'}</span>

            <span className='font-medium'>File Path:</span>
            <span>{filePath || 'Not set'}</span>

            <span className='font-medium'>Image Path:</span>
            <span>{imagePath || 'Not set'}</span>

            <span className='font-medium'>Available:</span>
            <span>{isAvailableForPurchase ? 'Yes' : 'No'}</span>

            <span className='font-medium'>Created:</span>
            <span>{createdAt ? new Date(createdAt).toLocaleString() : 'Not set'}</span>

            <span className='font-medium'>Updated:</span>
            <span>{updatedAt ? new Date(updatedAt).toLocaleString() : 'Not set'}</span>
          </div>

          <div className='space-y-2'>
            <span className='font-medium'>Description:</span>
            <p className='whitespace-pre-wrap'>{description || 'Not set'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
