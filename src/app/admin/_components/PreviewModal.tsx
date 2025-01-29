// prisma
import { Product } from '@prisma/client';

// shadcn
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// components
import PreviewProductCard from './PreviewProductCard';

// icons
import { Eye } from 'lucide-react';

interface PreviewModalProps {
  product: Partial<Product>;
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
      <DialogContent className='max-w-2xl overflow-y-scroll max-h-screen'>
        <DialogHeader>
          <DialogTitle>Product Preview</DialogTitle>
        </DialogHeader>
        <PreviewProductCard product={product} />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
