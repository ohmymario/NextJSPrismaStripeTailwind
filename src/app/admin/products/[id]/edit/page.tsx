// utils
import db from '@/db/db';

// components
import PageHeader from '../../../_components/PageHeader';
import ProductForm from '../../_components/ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

const getSingleProduct = (id: string) => {
  return db.product.findUnique({
    where: {
      id,
    },
  });
};

export default async function EditProductPage(props: EditProductPageProps) {
  const { id } = props.params;
  const product = await getSingleProduct(id);

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
