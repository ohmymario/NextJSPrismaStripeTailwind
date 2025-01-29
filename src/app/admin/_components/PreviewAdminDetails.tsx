import { Product } from '@prisma/client';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewAdminDetailsProps {
  product: Partial<Product>;
}

export default function PreviewAdminDetails({ product }: PreviewAdminDetailsProps) {
  const { id, name, priceInCents, filePath, imagePath, isAvailableForPurchase, createdAt, updatedAt, description } =
    product;

  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Admin Details</CardTitle>
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
  );
}
