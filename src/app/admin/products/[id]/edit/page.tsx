import { useParams } from 'next/navigation';
import PageHeader from '../../../_components/PageHeader';
import ProductForm from '../../_components/ProductForm';
import db from '@/db/db';

interface EditProductPageProps {}

export default async function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const product = await db.product.findUnique({
    where: {
      id,
    },
  });

  return (
    <>
      <PageHeader>Edit Product</PageHeader>

      {/* will accept a product to edit */}
      <ProductForm product={product} />
    </>
  );
}
