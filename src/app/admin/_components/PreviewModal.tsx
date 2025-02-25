// prisma
import { Product } from '@prisma/client';

// shadcn
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// components
import PreviewProductCard from './PreviewProductCard';

// icons
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import PreviewAdminDetails from './PreviewAdminDetails';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface PreviewModalProps {
  product: Partial<Product>;
}

const PreviewModal = ({ product }: PreviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

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

        {/* <Collapsible open={isOpen} onOpenChange={setIsOpen} className='mt-4'>
          <CollapsibleTrigger asChild>
            <Button variant='outline' className='w-full flex items-center justify-between'>
              Admin Details
              {isOpen ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='mt-2'>
            <PreviewAdminDetails product={product} />
          </CollapsibleContent>
        </Collapsible> */}
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
