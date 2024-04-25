import PageHeader from '../../_components/PageHeader';
import ProductForm from '../_components/ProductForm';

interface NewProductPageProps {}

export default function NewProductPage(props: NewProductPageProps) {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </>
  );
}
