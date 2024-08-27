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
import { addProduct, updateProduct } from '../../_actions/products';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@prisma/client';
import Image from 'next/image';

interface ProductFormProps {
  product?: Product | null;
}

export default function DiscountCodeForm() {
  const [error, action] = useFormState(addDiscountCode, {});

  return (
    <form className='space-y-8' action={action}>
      {/* Name of Code */}
      <div className='space-y-2'>
        <Label htmlFor='code'>Name</Label>
        <Input type='text' id='code' name='code' required />
        {error.code && <div className='text-destructive'>{error.code}</div>}
      </div>

      {/* Name of Code */}
      <div className='space-y-2 gap-8 flex items-baseline'>
        {/* SHADCN RADIO BUTTONS */}
        <div className='space-y-2'>
          <Label htmlFor='code'>Name</Label>
          <Input type='text' id='code' name='name' required />
          {error.code && <div className='text-destructive'>{error.code}</div>}
        </div>

        <div className='space-y-2 flex-grow'>
          <Label htmlFor='discountAmount'>Discount Amount</Label>
          <Input type='number' id='discountAmount' name='discountAmount' required />
          {error.discountAmount && <div className='text-destructive'>{error.discountAmount}</div>}
        </div>
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
