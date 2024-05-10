'use client';

// react
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

// shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// utils
import { formatCurrency } from '@/lib/formatters';

// actions
import { addProduct } from '../_actions/products';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@prisma/client';
import Image from 'next/image';

interface ProductFormProps {
  product: Product | null;
}

export default function ProductForm(props: ProductFormProps) {
  const { product } = props;

  const [error, action] = useFormState(addProduct, {});
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents);

  return (
    <form className='space-y-8' action={action}>
      {/* Name */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input type='text' id='name' name='name' required defaultValue={product?.name || ''} />
        {error.name && <div className='text-destructive'>{error.name}</div>}
      </div>

      {/* Price */}
      <div>
        <div className='space-y-2'>
          <Label htmlFor='priceInCents'>Price in Cents</Label>
          <Input
            type='number'
            id='priceInCents'
            name='priceInCents'
            required
            value={priceInCents}
            onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
          />
        </div>
        <div className='text-muted-foreground'>{formatCurrency((priceInCents || 0) / 100)}</div>
        {error.priceInCents && <div className='text-destructive'>{error.priceInCents}</div>}
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea id='description' name='description' required defaultValue={product?.description} />
        {error.description && <div className='text-destructive'>{error.description}</div>}
      </div>

      {/* File */}
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input type='file' id='file' name='file' required={product === null} />

        {/* File Path */}
        {product != null && <div className='text-muted-foreground'>{product.filePath}</div>}

        {error.file && <div className='text-destructive'>{error.file}</div>}
      </div>

      {/* Image */}
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input type='file' id='image' name='image' required={product === null} />

        {/* File Path */}
        {product != null && <Image src={product.imagePath} width={400} height={400} alt={product.name} />}

        {error.image && <div className='text-destructive'>{error.image}</div>}
      </div>

      <SubmitButton />
    </form>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
};
