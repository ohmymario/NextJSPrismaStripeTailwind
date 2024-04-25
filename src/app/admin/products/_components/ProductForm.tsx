'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';
import { addProduct } from '../_actions/products';

interface ProductFormProps {}

export default function ProductForm(props: ProductFormProps) {
  const [priceInCents, setPriceInCents] = useState<number>();

  return (
    <form className='space-y-8' action={addProduct}>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input type='text' id='name' name='name' required />
      </div>

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
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>description</Label>
        <Input type='text' id='description' name='description' required />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input type='file' id='file' name='file' required />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='image'>Imag</Label>
        <Input type='file' id='image' name='image' required />
      </div>

      <Button type='submit'>Save</Button>
    </form>
  );
}
