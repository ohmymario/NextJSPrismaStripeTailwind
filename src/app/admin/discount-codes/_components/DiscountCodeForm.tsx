'use client';

// react
import { useFormState, useFormStatus } from 'react-dom';

// shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// actions
import { DiscountCodeType } from '@prisma/client';
import { useState } from 'react';
import { addDiscountCode } from '../../_actions/discountCodes';

const getCurrentDateTimeLocal = () => {
  // Chatgpt Function
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const adjustedDate = new Date(now.getTime() - offset * 60 * 1000); // Adjust for timezone offset
  return adjustedDate.toISOString().slice(0, 16); // Use slice to get 'YYYY-MM-DDTHH:MM' format
};

interface DiscountCodeFormProps {
  products: {
    id: string;
    name: string;
  }[];
}

export default function DiscountCodeForm({ products }: DiscountCodeFormProps) {
  const [error, action] = useFormState(addDiscountCode, {});
  const [allProducts, setAllProducts] = useState(true);

  return (
    <form className='space-y-8' action={action}>
      {/* CODE */}
      <div className='space-y-2'>
        {/* Name of Code */}

        <Label htmlFor='code'>Code</Label>
        <Input type='text' id='code' name='code' required />
        {error.code && <div className='text-destructive'>{error.code}</div>}
      </div>

      {/* TYPE AND AMOUNT */}
      <div className='space-y-2 gap-8 flex items-baseline'>
        {/* Discount Type */}
        <div className='space-y-2'>
          <Label htmlFor='discountType'>Discount Type</Label>

          <RadioGroup id='discountType' name='discountType' defaultValue={DiscountCodeType.PERCENTAGE}>
            {/* PERCENTAGE */}
            <div className='flex gap-2 items-center'>
              <RadioGroupItem value={DiscountCodeType.PERCENTAGE} id='percentage' />
              <Label htmlFor='percentage'>Percentage</Label>
            </div>

            {/* FIXED */}
            <div className='flex gap-2 items-center'>
              <RadioGroupItem value={DiscountCodeType.FIXED} id='fixed' />
              <Label htmlFor='fixed'>Fixed</Label>
            </div>
          </RadioGroup>

          {error.discountType && (
            <div className='text-destructive'>{` error for discount type ${error.discountType}`}</div>
          )}
        </div>

        {/* AMOUNT DISCOUNTED*/}
        <div className='space-y-2 flex-grow'>
          <Label htmlFor='discountAmount'>Discount Amount</Label>
          <Input type='number' id='discountAmount' name='discountAmount' required />
          {error.discountAmount && <div className='text-destructive'>{error.discountAmount}</div>}
        </div>
      </div>

      {/* LIMIT */}
      <div className='space-y-2'>
        <Label htmlFor='limit'>Limit</Label>
        <Input type='number' id='limit' name='limit' />
        <div>Leave blank for infinite uses</div>
        {error.limit && <div className='text-destructive'>{error.limit}</div>}
      </div>

      {/* Expiration Date */}
      <div className='space-y-2'>
        <Label htmlFor='expiresAt'>Expiration</Label>
        <Input
          type='datetime-local'
          min={getCurrentDateTimeLocal()} // Use the current date and time
          id='expiresAt'
          name='expiresAt'
          className='w-max'
        />
        <div>Leave blank for no expiration</div>

        {error.expiresAt && <div className='text-destructive'>{error.expiresAt}</div>}
      </div>

      {/* CODE */}
      <div className='space-y-2'>
        {error.allProducts && <div className='text-destructive'>{error.allProducts}</div>}
        {error.productIds && <div className='text-destructive'>{error.productIds}</div>}

        <Label>Allowed Products</Label>
        <div className='flex gap-2 items-center'>
          <Checkbox
            id='allProducts'
            name='allProducts'
            checked={allProducts}
            onCheckedChange={(e) => setAllProducts(e === true)}
          />
          <Label htmlFor='allProducts'>All Products</Label>
        </div>

        {products.map((product) => (
          <div key={product.id} className='flex gap-2 items-center'>
            <Checkbox id={product.id} name='productIds' disabled={allProducts} value={product.id} />
            <Label htmlFor={product.id}>{product.name}</Label>
          </div>
        ))}
      </div>

      {/* SUBMIT */}
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
