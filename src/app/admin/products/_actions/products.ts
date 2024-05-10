"use server"

import db from '@/db/db';
import fs from 'fs/promises';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

// Define a schema for the file to ensure it's an instance of File and refine for size
const fileSchema = z
  .instanceof(File, { message: "Required" }
  );

// Define a schema for the file to ensure it's an instance of File and refine for size
const imageSchema = z
  .instanceof(File, { message: "Required" })
  .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: 'File must be an image', })
  .refine(file => file.size <= 1024 * 1024 * 5, { message: 'File size must be less than 5MB', });


// Define a schema for the form data
const addSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  priceInCents: z.coerce.number().int().positive().min(1),
  file: fileSchema.refine(file => file.size > 0, "Required"),
  image: imageSchema.refine(file => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    console.log(result.error)
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir('products', { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  const fileBuffer = await data.file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(fileBuffer));

  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  const imageBuffer = await data.image.arrayBuffer();
  await fs.writeFile(`public${imagePath}`, Buffer.from(imageBuffer));

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath
    },
  });

  redirect('/admin/products');
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({
    // location
    where: { id },
    // toggled boolean value
    data: { isAvailableForPurchase },
  });
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({
    where: { id },
  });


  if (product === null) return notFound();

  const filePath = product.filePath;
  const imagePath = `public${product.imagePath}`;
  await fs.unlink(filePath);
  await fs.unlink(imagePath);

}