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
import PreviewProductCard from './PreviewProductCard';

// icons
import { Eye } from 'lucide-react';
import Image from 'next/image';

interface PreviewModalProps {
  product: Partial<{
    id: string;
    name: string;
    description: string;
    priceInCents: number;
    filePath: string;
    imagePath: string;
    isAvailableForPurchase: boolean;
    createdAt: Date;
    updatedAt: Date;
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
        <PreviewProductCard product={product} />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
