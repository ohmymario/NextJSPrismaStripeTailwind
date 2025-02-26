'use client';

// large deps
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@prisma/client';
import { useFormState, useFormStatus } from 'react-dom';

// shadcn
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// components
import PreviewModal from '../../_components/PreviewModal';

// utils
import { formatCurrency } from '@/lib/formatters';

// actions
import { addProduct, updateProduct } from '../../_actions/products';

interface ProductFormProps {
  product?: Product | null;
}

export default function ProductForm({ product }: ProductFormProps) {
  const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {});

  // controlled inputs for preview modal
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents);
  const [name, setName] = useState<string>(product?.name || '');
  const [description, setDescription] = useState<string>(product?.description || '');
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  return (
    <>
      <form className='space-y-8' action={action}>
        {/* Name */}
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input type='text' id='name' name='name' required value={name} onChange={(e) => setName(e.target.value)} />
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
              onChange={(e) => setPriceInCents(Number(e.target.value) || 0)}
            />
          </div>
          <div className='text-muted-foreground'>{formatCurrency((priceInCents || 0) / 100)}</div>
          {error.priceInCents && <div className='text-destructive'>{error.priceInCents}</div>}
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            name='description'
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error.description && <div className='text-destructive'>{error.description}</div>}
        </div>

        {/* File */}
        <div className='space-y-2'>
          <Label htmlFor='file'>File</Label>
          <Input
            type='file'
            id='file'
            name='file'
            required={product === null}
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />

          {/* File Path */}
          {product != null && <div className='text-muted-foreground'>{product.filePath}</div>}

          {error.file && <div className='text-destructive'>{error.file}</div>}
        </div>

        {/* Image */}
        <div className='space-y-2'>
          <Label htmlFor='image'>Image</Label>
          <Input
            type='file'
            id='image'
            name='image'
            accept='image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/webp'
            required={product === null}
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />

          {/* Display Image Preview */}
          {image && (
            <Image src={URL.createObjectURL(image)} width={400} height={400} alt={name} className='object-cover' />
          )}

          {/* Existing Image */}
          {product != null && !image && (
            <Image src={product.imagePath} width={400} height={400} alt={product.name} className='object-cover' />
          )}

          {error.image && <div className='text-destructive'>{error.image}</div>}
        </div>

        <div className='flex gap-4'>
          <PreviewModal
            product={{
              id: product?.id,
              name,
              description,
              priceInCents,
              filePath: file ? file.name : product?.filePath || '',
              imagePath: image ? URL.createObjectURL(image) : product?.imagePath || '',
              isAvailableForPurchase: product?.isAvailableForPurchase || false,
              createdAt: product?.createdAt,
              updatedAt: product?.updatedAt,
            }}
          />

          <SubmitButton />
        </div>
      </form>
    </>
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
