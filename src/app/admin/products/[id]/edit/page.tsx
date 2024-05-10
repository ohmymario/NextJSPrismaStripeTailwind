// utils
import { getItem } from '@/lib/getItem';

// components
import PageHeader from '../../../_components/PageHeader';
import ProductForm from '../../_components/ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage(props: EditProductPageProps) {
  const { id } = props.params;
  const product = await getItem(id);

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
