// shadcn
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// components
import { ProductCard } from '@/components/ProductCard';

// icons
import { Eye } from 'lucide-react';

interface PreviewModalProps {
  product: Partial<{
    id: string;
    name: string;
    description: string;
    priceInCents: number;
    imagePath: string;
    isAvailableForPurchase: boolean;
  }>;
}

const PreviewModal = ({ product }: PreviewModalProps) => {
  return (
    <Dialog>
      {/* VISIBLE BUTTON */}
      <DialogTrigger asChild>
        <Button variant='outline' type='button' className='gap-2'>
          <Eye className='h-4 w-4' />
          Preview
        </Button>
      </DialogTrigger>

      {/* ACTUAL MODAL CONTENT */}
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Product Preview</DialogTitle>
        </DialogHeader>
        {/* TODO: Add ProductCard component w/ preview prop */}
        {/* <ProductCard product={product} preview /> */}

        {/* TEMPORARY */}
        <DialogDescription>
          <p>{product.name}</p>
          <p>{product.description}</p>
          <p>${product.priceInCents}</p>
          <p>{product.imagePath}</p>
          <p>{product.isAvailableForPurchase}</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
